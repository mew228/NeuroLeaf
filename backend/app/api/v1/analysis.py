from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User
from app.models.journal import JournalEntry
from app.models.analysis import AIAnalysis
from app.schemas.analysis import AIAnalysisResponse, SentimentInfo, EmotionInfo, StressInfo
from app.middleware.auth import get_current_user
from app.services.ai_service import ai_service

router = APIRouter(prefix="/analysis", tags=["AI Analysis"])


@router.get("/{journal_id}", response_model=AIAnalysisResponse)
async def get_analysis(
    journal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get AI analysis for a journal entry."""
    # Verify journal entry belongs to user
    journal_result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == journal_id,
            JournalEntry.user_id == current_user.id
        )
    )
    journal_entry = journal_result.scalar_one_or_none()
    
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    # Get analysis
    analysis_result = await db.execute(
        select(AIAnalysis).where(AIAnalysis.journal_id == journal_id)
    )
    analysis = analysis_result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found for this journal entry"
        )
    
    return AIAnalysisResponse(
        journal_id=analysis.journal_id,
        sentiment=SentimentInfo(
            score=float(analysis.sentiment_score),
            label=analysis.sentiment_label
        ),
        emotions=EmotionInfo(
            primary=analysis.primary_emotion,
            scores=analysis.emotion_scores
        ),
        stress=StressInfo(
            level=analysis.stress_level,
            keywords=analysis.stress_keywords or []
        ),
        ai_reflection=analysis.ai_reflection if not analysis.crisis_detected else None,
        crisis_detected=analysis.crisis_detected,
        processed_at=analysis.processed_at
    )


@router.post("/trigger/{journal_id}", response_model=dict, status_code=status.HTTP_202_ACCEPTED)
async def trigger_analysis(
    journal_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Manually trigger AI analysis for a journal entry."""
    # Verify journal entry belongs to user
    journal_result = await db.execute(
        select(JournalEntry).where(
            JournalEntry.id == journal_id,
            JournalEntry.user_id == current_user.id
        )
    )
    journal_entry = journal_result.scalar_one_or_none()
    
    if not journal_entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    # Check if analysis already exists
    existing_result = await db.execute(
        select(AIAnalysis).where(AIAnalysis.journal_id == journal_id)
    )
    if existing_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Analysis already exists for this journal entry"
        )
    
    # Perform analysis
    analysis = await ai_service.analyze_journal_entry(journal_entry, db)
    
    return {
        "journal_id": str(journal_id),
        "sentiment": {
            "score": float(analysis.sentiment_score),
            "label": analysis.sentiment_label
        },
        "emotions": {
            "primary": analysis.primary_emotion,
            "scores": analysis.emotion_scores
        },
        "stress": {
            "level": analysis.stress_level,
            "keywords": analysis.stress_keywords or []
        },
        "ai_reflection": analysis.ai_reflection if not analysis.crisis_detected else None,
        "crisis_detected": analysis.crisis_detected,
        "processed_at": analysis.processed_at.isoformat()
    }
