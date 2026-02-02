from pydantic import BaseModel, Field
from datetime import datetime, date
import uuid


class MoodEntryCreate(BaseModel):
    mood_score: int = Field(..., ge=1, le=10)
    mood_emoji: str | None = None
    mood_label: str | None = None
    notes: str | None = None
    entry_date: date


class MoodEntryResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    mood_score: int
    mood_emoji: str | None
    mood_label: str | None
    notes: str | None
    entry_date: date
    created_at: datetime
    
    model_config = {
        "from_attributes": True
    }


class MoodHistoryResponse(BaseModel):
    entries: list[MoodEntryResponse]
    summary: dict
