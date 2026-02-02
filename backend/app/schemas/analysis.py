from pydantic import BaseModel
from datetime import datetime
import uuid


class SentimentInfo(BaseModel):
    score: float
    label: str


class EmotionInfo(BaseModel):
    primary: str
    scores: dict[str, float]


class StressInfo(BaseModel):
    level: str
    keywords: list[str]


class AIAnalysisResponse(BaseModel):
    journal_id: uuid.UUID
    sentiment: SentimentInfo
    emotions: EmotionInfo
    stress: StressInfo
    ai_reflection: str | None
    crisis_detected: bool
    processed_at: datetime
    
    model_config = {
        "from_attributes": True
    }
