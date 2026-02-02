"""
Background tasks for AI analysis operations.
These tasks run asynchronously via Celery to avoid blocking the API.
"""

from celery import shared_task
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from app.config import get_settings
from app.models.journal import JournalEntry
from app.models.analysis import AIAnalysis
from app.ml import sentiment_analyzer, emotion_classifier, crisis_detector, reflection_generator
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Sync engine for Celery (Celery doesn't play well with async)
sync_engine = create_engine(
    settings.DATABASE_URL.replace("+asyncpg", ""),
    echo=False
)
SessionLocal = sessionmaker(bind=sync_engine)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def analyze_journal_entry_async(self, journal_id: str, user_id: str):
    """
    Perform complete AI analysis on a journal entry asynchronously.
    
    Args:
        journal_id: UUID of the journal entry
        user_id: UUID of the user
    """
    logger.info(f"Starting async analysis for journal {journal_id}")
    
    try:
        with SessionLocal() as db:
            # Fetch the journal entry
            result = db.execute(
                select(JournalEntry).where(JournalEntry.id == journal_id)
            )
            entry = result.scalar_one_or_none()
            
            if not entry:
                logger.error(f"Journal entry {journal_id} not found")
                return {"status": "error", "message": "Entry not found"}
            
            content = entry.content
            
            # 1. Sentiment Analysis
            sentiment_result = sentiment_analyzer.analyze(content)
            
            # 2. Emotion Classification
            emotion_result = emotion_classifier.analyze(content)
            
            # 3. Crisis Detection
            crisis_result = crisis_detector.detect(content)
            
            # 4. Generate AI Reflection
            reflection_result = reflection_generator.generate(
                journal_content=content,
                primary_emotion=emotion_result['primary'],
                sentiment_label=sentiment_result['label'],
                stress_level=crisis_result['stress_level'],
                crisis_detected=crisis_result['crisis_detected']
            )
            
            # 5. Create AI Analysis record
            analysis = AIAnalysis(
                user_id=user_id,
                journal_id=journal_id,
                sentiment_score=sentiment_result['score'],
                sentiment_label=sentiment_result['label'],
                primary_emotion=emotion_result['primary'],
                emotion_scores=emotion_result['scores'],
                stress_level=crisis_result['stress_level'],
                stress_keywords=crisis_result['stress_keywords'],
                ai_reflection=reflection_result['reflection'],
                reflection_tone=reflection_result['tone'],
                crisis_detected=crisis_result['crisis_detected'],
                crisis_severity=crisis_result['severity'],
                model_version=reflection_result['model_version']
            )
            
            db.add(analysis)
            db.commit()
            
            logger.info(f"Analysis complete for journal {journal_id}")
            
            return {
                "status": "success",
                "journal_id": journal_id,
                "sentiment": sentiment_result['label'],
                "primary_emotion": emotion_result['primary'],
                "crisis_detected": crisis_result['crisis_detected']
            }
            
    except Exception as e:
        logger.exception(f"Analysis failed for journal {journal_id}: {e}")
        raise self.retry(exc=e)


@shared_task
def cleanup_stale_embeddings():
    """
    Cleanup old vector embeddings that are no longer needed.
    Runs daily via Celery Beat.
    """
    logger.info("Running stale embeddings cleanup...")
    # TODO: Implement ChromaDB cleanup logic
    return {"status": "success", "cleaned": 0}


@shared_task
def generate_user_embeddings(user_id: str):
    """
    Generate vector embeddings for all of a user's journal entries.
    Used for RAG-based insights.
    """
    logger.info(f"Generating embeddings for user {user_id}")
    # TODO: Implement ChromaDB embedding generation
    return {"status": "success", "user_id": user_id}
