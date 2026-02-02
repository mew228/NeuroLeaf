import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, Numeric, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSON
from datetime import datetime
from app.database import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    journal_id = Column(UUID(as_uuid=True), ForeignKey("journal_entries.id", ondelete="CASCADE"), nullable=False)
    mood_id = Column(UUID(as_uuid=True), ForeignKey("mood_entries.id", ondelete="SET NULL"))
    
    # Sentiment Analysis
    sentiment_score = Column(Numeric(3, 2))  # -1.0 to 1.0
    sentiment_label = Column(String(20))  # 'positive', 'negative', 'neutral'
    
    # Emotion Classification
    primary_emotion = Column(String(50))
    emotion_scores = Column(JSON)  # {'joy': 0.8, 'sadness': 0.1, ...}
    
    # Stress & Patterns
    stress_level = Column(String(20))  # 'low', 'moderate', 'high'
    stress_keywords = Column(ARRAY(Text))
    
    # AI Reflection
    ai_reflection = Column(Text)
    reflection_tone = Column(String(50))  # 'supportive', 'encouraging', 'grounding'
    
    # Safety
    crisis_detected = Column(Boolean, default=False)
    crisis_severity = Column(String(20))  # 'none', 'moderate', 'severe'
    
    processed_at = Column(DateTime, default=datetime.utcnow)
    model_version = Column(String(50))

    def __repr__(self):
        return f"<AIAnalysis {self.journal_id} - Sentiment: {self.sentiment_label}>"
