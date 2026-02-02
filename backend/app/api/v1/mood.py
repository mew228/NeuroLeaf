from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import datetime, timedelta
from app.database import get_db
from app.models.user import User
from app.models.mood import MoodEntry
from app.schemas.mood import MoodEntryCreate, MoodEntryResponse, MoodHistoryResponse
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/mood", tags=["Mood Tracking"])


@router.post("/entry", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_mood_entry(
    mood_data: MoodEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new mood entry."""
    # Check if entry already exists for this date
    result = await db.execute(
        select(MoodEntry).where(
            MoodEntry.user_id == current_user.id,
            MoodEntry.entry_date == mood_data.entry_date
        )
    )
    existing_entry = result.scalar_one_or_none()
    
    if existing_entry:
        # Update existing entry
        existing_entry.mood_score = mood_data.mood_score
        existing_entry.mood_emoji = mood_data.mood_emoji
        existing_entry.mood_label = mood_data.mood_label
        existing_entry.notes = mood_data.notes
        mood_entry = existing_entry
        message = "Mood entry updated"
    else:
        # Create new mood entry
        mood_entry = MoodEntry(
            user_id=current_user.id,
            mood_score=mood_data.mood_score,
            mood_emoji=mood_data.mood_emoji,
            mood_label=mood_data.mood_label,
            notes=mood_data.notes,
            entry_date=mood_data.entry_date
        )
        db.add(mood_entry)
        message = "Mood entry saved"
    
    await db.commit()
    await db.refresh(mood_entry)
    
    return {
        "id": str(mood_entry.id),
        "user_id": str(mood_entry.user_id),
        "mood_score": mood_entry.mood_score,
        "created_at": mood_entry.created_at,
        "message": message
    }


@router.get("/history", response_model=MoodHistoryResponse)
async def get_mood_history(
    period: str = Query("weekly", regex="^(weekly|monthly|yearly)$"),
    limit: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get mood history for the user."""
    # Calculate date range
    end_date = datetime.now().date()
    if period == "weekly":
        start_date = end_date - timedelta(days=7)
    elif period == "monthly":
        start_date = end_date - timedelta(days=30)
    else:  # yearly
        start_date = end_date - timedelta(days=365)
    
    # Fetch entries
    result = await db.execute(
        select(MoodEntry)
        .where(
            MoodEntry.user_id == current_user.id,
            MoodEntry.entry_date >= start_date,
            MoodEntry.entry_date <= end_date
        )
        .order_by(desc(MoodEntry.entry_date))
        .limit(limit)
    )
    entries = result.scalars().all()
    
    # Calculate summary
    avg_mood = 0
    trend = "stable"
    if entries:
        avg_result = await db.execute(
            select(func.avg(MoodEntry.mood_score))
            .where(
                MoodEntry.user_id == current_user.id,
                MoodEntry.entry_date >= start_date
            )
        )
        avg_mood = float(avg_result.scalar() or 0)
        
        # Simple trend calculation (compare first vs last half)
        mid_point = len(entries) // 2
        if mid_point > 0:
            recent_avg = sum(e.mood_score for e in entries[:mid_point]) / mid_point
            older_avg = sum(e.mood_score for e in entries[mid_point:]) / (len(entries) - mid_point)
            if recent_avg > older_avg + 0.3:
                trend = "improving"
            elif recent_avg < older_avg - 0.3:
                trend = "declining"
    
    return MoodHistoryResponse(
        entries=[MoodEntryResponse.from_orm(entry) for entry in entries],
        summary={
            "avg_mood": round(avg_mood, 2),
            "trend": trend
        }
    )
