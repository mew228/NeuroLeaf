from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from datetime import datetime
from app.database import get_db
from app.models.user import User
from app.models.journal import JournalEntry
from app.models.analysis import AIAnalysis
from app.schemas.journal import JournalEntryCreate, JournalEntryResponse, JournalListResponse
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/journal", tags=["Journal"])


@router.post("/entry", response_model=dict, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    journal_data: JournalEntryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new journal entry."""
    # Calculate word count
    word_count = len(journal_data.content.split())
    
    # Create journal entry
    journal_entry = JournalEntry(
        user_id=current_user.id,
        title=journal_data.title,
        content=journal_data.content,
        word_count=word_count,
        entry_date=journal_data.entry_date
    )
    
    db.add(journal_entry)
    await db.commit()
    await db.refresh(journal_entry)
    
    # TODO: Trigger AI analysis in background task
    
    return {
        "id": str(journal_entry.id),
        "title": journal_entry.title,
        "word_count": journal_entry.word_count,
        "created_at": journal_entry.created_at,
        "ai_analysis_pending": True
    }


@router.get("/entries", response_model=JournalListResponse)
async def get_journal_entries(
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get paginated list of journal entries."""
    # Get total count
    count_result = await db.execute(
        select(func.count(JournalEntry.id))
        .where(JournalEntry.user_id == current_user.id)
    )
    total = count_result.scalar()
    
    # Fetch entries with analysis status using a join
    result = await db.execute(
        select(JournalEntry, AIAnalysis.id.isnot(None).label("has_analysis"))
        .outerjoin(AIAnalysis, JournalEntry.id == AIAnalysis.journal_id)
        .where(JournalEntry.user_id == current_user.id)
        .order_by(desc(JournalEntry.created_at))
        .limit(limit)
        .offset(offset)
    )
    rows = result.all()
    
    entry_responses = []
    for entry, has_analysis in rows:
        entry_responses.append(
            JournalEntryResponse(
                id=entry.id,
                user_id=entry.user_id,
                title=entry.title,
                content=entry.content,
                word_count=entry.word_count,
                entry_date=entry.entry_date,
                created_at=entry.created_at,
                updated_at=entry.updated_at,
                has_analysis=has_analysis
            )
        )
    
    return JournalListResponse(
        entries=entry_responses,
        total=total or 0,
        page=(offset // limit) + 1
    )


@router.get("/entry/{entry_id}", response_model=JournalEntryResponse)
async def get_journal_entry(
    entry_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific journal entry."""
    result = await db.execute(
        select(JournalEntry)
        .where(
            JournalEntry.id == entry_id,
            JournalEntry.user_id == current_user.id
        )
    )
    entry = result.scalar_one_or_none()
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )
    
    # Check for analysis
    analysis_result = await db.execute(
        select(AIAnalysis).where(AIAnalysis.journal_id == entry.id)
    )
    has_analysis = analysis_result.scalar_one_or_none() is not None
    
    response = JournalEntryResponse.from_orm(entry)
    response.has_analysis = has_analysis
    
    return response
