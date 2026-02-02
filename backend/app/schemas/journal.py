from pydantic import BaseModel
from datetime import datetime, date
import uuid


class JournalEntryCreate(BaseModel):
    title: str | None = None
    content: str
    entry_date: date


class JournalEntryResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str | None
    content: str
    word_count: int | None
    entry_date: date
    created_at: datetime
    updated_at: datetime
    has_analysis: bool = False
    
    model_config = {
        "from_attributes": True
    }


class JournalListResponse(BaseModel):
    entries: list[JournalEntryResponse]
    total: int
    page: int
