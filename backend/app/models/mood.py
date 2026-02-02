import uuid
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database import Base


class MoodEntry(Base):
    __tablename__ = "mood_entries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    mood_score = Column(Integer, nullable=False)  # 1-5
    mood_emoji = Column(String(10))
    mood_label = Column(String(50))  # e.g., 'happy', 'anxious', 'calm'
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    entry_date = Column(Date, nullable=False)

    def __repr__(self):
        return f"<MoodEntry {self.entry_date} - Score: {self.mood_score}>"
