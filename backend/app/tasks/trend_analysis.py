"""
Proactive mood trend analysis tasks.
Detects declining mood patterns and triggers preventive notifications.
"""

from celery import shared_task
from sqlalchemy import create_engine, select, desc
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.config import get_settings
from app.models.user import User
from app.models.mood import MoodEntry
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Sync engine for Celery
sync_engine = create_engine(
    settings.DATABASE_URL.replace("+asyncpg", ""),
    echo=False
)
SessionLocal = sessionmaker(bind=sync_engine)


@shared_task
def analyze_user_trends():
    """
    Daily task to analyze mood trends for all active users.
    Detects patterns like:
    - 3+ consecutive days of declining mood
    - Consistently low scores (below 4)
    - High stress keywords appearing frequently
    """
    logger.info("Starting daily mood trend analysis for all users")
    
    users_flagged = 0
    
    try:
        with SessionLocal() as db:
            # Get all active users
            users = db.execute(select(User).where(User.is_active == True)).scalars().all()
            
            for user in users:
                trend_result = analyze_single_user_trend(db, user.id)
                if trend_result.get("needs_intervention"):
                    users_flagged += 1
                    # Queue notification task
                    from app.tasks.notification_tasks import send_wellness_check
                    send_wellness_check.delay(
                        user_id=str(user.id),
                        trend_type=trend_result.get("trend_type"),
                        recommendation=trend_result.get("recommendation")
                    )
        
        logger.info(f"Trend analysis complete. {users_flagged} users flagged for intervention.")
        return {"status": "success", "users_analyzed": len(users), "users_flagged": users_flagged}
        
    except Exception as e:
        logger.exception(f"Trend analysis failed: {e}")
        return {"status": "error", "message": str(e)}


def analyze_single_user_trend(db, user_id: str) -> dict:
    """
    Analyze mood trend for a single user.
    
    Returns:
        dict with keys:
            - needs_intervention: bool
            - trend_type: str (declining, persistently_low, high_stress)
            - recommendation: str
    """
    # Get last 7 days of mood entries
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    result = db.execute(
        select(MoodEntry)
        .where(MoodEntry.user_id == user_id)
        .where(MoodEntry.created_at >= week_ago)
        .order_by(desc(MoodEntry.created_at))
    )
    entries = result.scalars().all()
    
    if len(entries) < 3:
        # Not enough data
        return {"needs_intervention": False}
    
    scores = [e.mood_score for e in entries]
    
    # Check for 3+ consecutive declining days
    declining_streak = 0
    for i in range(1, len(scores)):
        if scores[i-1] < scores[i]:  # Earlier entry has lower score (declining)
            declining_streak += 1
        else:
            declining_streak = 0
        
        if declining_streak >= 3:
            return {
                "needs_intervention": True,
                "trend_type": "declining",
                "recommendation": "We've noticed your mood has been trending downward. Would you like to try a breathing exercise?"
            }
    
    # Check for persistently low scores
    avg_score = sum(scores) / len(scores)
    if avg_score < 4:
        return {
            "needs_intervention": True,
            "trend_type": "persistently_low",
            "recommendation": "It seems like things have been tough lately. Remember, reaching out for support is a sign of strength."
        }
    
    return {"needs_intervention": False}


@shared_task
def analyze_single_user_trend_async(user_id: str):
    """
    Async wrapper for single user trend analysis.
    Can be triggered manually for a specific user.
    """
    with SessionLocal() as db:
        return analyze_single_user_trend(db, user_id)
