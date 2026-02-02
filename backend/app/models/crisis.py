import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.database import Base


class CrisisLog(Base):
    __tablename__ = "crisis_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    journal_id = Column(UUID(as_uuid=True), ForeignKey("journal_entries.id", ondelete="SET NULL"))
    analysis_id = Column(UUID(as_uuid=True), ForeignKey("ai_analysis.id", ondelete="SET NULL"))
    
    detected_patterns = Column(ARRAY(Text))
    severity_level = Column(String(20), nullable=False)
    flagged_content = Column(Text)  # Redacted/anonymized excerpt
    
    # Resources Provided
    resources_shown = Column(ARRAY(Text))  # Links to crisis hotlines
    user_acknowledged = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<CrisisLog {self.severity_level} - {self.created_at}>"
