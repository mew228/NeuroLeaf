"""
Data export tasks for user data portability.
Generates PDF and JSON exports of user history.
"""

from celery import shared_task
from sqlalchemy import create_engine, select, desc
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from io import BytesIO
import json
import logging

from app.config import get_settings
from app.models.user import User
from app.models.journal import JournalEntry
from app.models.mood import MoodEntry
from app.models.analysis import AIAnalysis

logger = logging.getLogger(__name__)
settings = get_settings()

# Sync engine for Celery
sync_engine = create_engine(
    settings.DATABASE_URL.replace("+asyncpg", ""),
    echo=False
)
SessionLocal = sessionmaker(bind=sync_engine)


@shared_task
def generate_json_export(user_id: str) -> dict:
    """
    Generate a complete JSON export of user data.
    
    Returns:
        dict with export data and metadata
    """
    logger.info(f"Generating JSON export for user {user_id}")
    
    try:
        with SessionLocal() as db:
            # Fetch user
            user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
            if not user:
                return {"status": "error", "message": "User not found"}
            
            # Fetch all journal entries
            journals = db.execute(
                select(JournalEntry)
                .where(JournalEntry.user_id == user_id)
                .order_by(desc(JournalEntry.created_at))
            ).scalars().all()
            
            # Fetch all mood entries
            moods = db.execute(
                select(MoodEntry)
                .where(MoodEntry.user_id == user_id)
                .order_by(desc(MoodEntry.created_at))
            ).scalars().all()
            
            # Fetch all analyses
            analyses = db.execute(
                select(AIAnalysis)
                .where(AIAnalysis.user_id == user_id)
                .order_by(desc(AIAnalysis.created_at))
            ).scalars().all()
            
            export_data = {
                "export_metadata": {
                    "generated_at": datetime.utcnow().isoformat(),
                    "user_email": user.email,
                    "export_version": "1.0",
                },
                "profile": {
                    "email": user.email,
                    "full_name": user.full_name,
                    "created_at": user.created_at.isoformat() if user.created_at else None,
                },
                "journal_entries": [
                    {
                        "id": str(j.id),
                        "title": j.title,
                        "content": j.content,
                        "word_count": j.word_count,
                        "entry_date": j.entry_date.isoformat() if j.entry_date else None,
                        "created_at": j.created_at.isoformat() if j.created_at else None,
                    }
                    for j in journals
                ],
                "mood_entries": [
                    {
                        "id": str(m.id),
                        "mood_score": m.mood_score,
                        "mood_emoji": m.mood_emoji,
                        "mood_label": m.mood_label,
                        "notes": m.notes,
                        "entry_date": m.entry_date.isoformat() if m.entry_date else None,
                        "created_at": m.created_at.isoformat() if m.created_at else None,
                    }
                    for m in moods
                ],
                "ai_analyses": [
                    {
                        "id": str(a.id),
                        "journal_id": str(a.journal_id) if a.journal_id else None,
                        "sentiment_label": a.sentiment_label,
                        "primary_emotion": a.primary_emotion,
                        "stress_level": a.stress_level,
                        "ai_reflection": a.ai_reflection,
                        "crisis_detected": a.crisis_detected,
                        "created_at": a.created_at.isoformat() if a.created_at else None,
                    }
                    for a in analyses
                ],
            }
            
            logger.info(f"JSON export complete for user {user_id}: {len(journals)} journals, {len(moods)} moods")
            
            return {
                "status": "success",
                "data": export_data,
                "counts": {
                    "journals": len(journals),
                    "moods": len(moods),
                    "analyses": len(analyses),
                }
            }
            
    except Exception as e:
        logger.exception(f"JSON export failed for user {user_id}: {e}")
        return {"status": "error", "message": str(e)}


@shared_task
def generate_pdf_export(user_id: str) -> dict:
    """
    Generate a formatted PDF export of user data.
    Uses ReportLab for PDF generation.
    """
    logger.info(f"Generating PDF export for user {user_id}")
    
    try:
        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        from reportlab.lib import colors
        from reportlab.lib.units import inch
        
        # First get the JSON data
        json_result = generate_json_export(user_id)
        if json_result["status"] != "success":
            return json_result
        
        data = json_result["data"]
        
        # Create PDF in memory
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
        
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle('Title', parent=styles['Heading1'], fontSize=24, spaceAfter=20)
        heading_style = ParagraphStyle('Heading', parent=styles['Heading2'], fontSize=16, spaceBefore=20, spaceAfter=10)
        body_style = styles['Normal']
        
        story = []
        
        # Title
        story.append(Paragraph("NeuroLeaf - Your Mental Health Journey", title_style))
        story.append(Paragraph(f"Exported on {data['export_metadata']['generated_at'][:10]}", body_style))
        story.append(Spacer(1, 20))
        
        # Profile Section
        story.append(Paragraph("Profile", heading_style))
        story.append(Paragraph(f"Name: {data['profile']['full_name']}", body_style))
        story.append(Paragraph(f"Email: {data['profile']['email']}", body_style))
        story.append(Spacer(1, 20))
        
        # Mood Summary
        if data['mood_entries']:
            story.append(Paragraph("Mood History", heading_style))
            mood_data = [["Date", "Score", "Feeling", "Notes"]]
            for m in data['mood_entries'][:20]:  # Last 20 entries
                mood_data.append([
                    m['entry_date'][:10] if m['entry_date'] else "N/A",
                    str(m['mood_score']),
                    m['mood_label'] or "N/A",
                    (m['notes'][:50] + "...") if m['notes'] and len(m['notes']) > 50 else (m['notes'] or "N/A"),
                ])
            
            table = Table(mood_data, colWidths=[1.2*inch, 0.8*inch, 1.2*inch, 3*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#10b981")),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ]))
            story.append(table)
            story.append(Spacer(1, 20))
        
        # Journal Entries Summary
        if data['journal_entries']:
            story.append(Paragraph("Journal Entries", heading_style))
            for j in data['journal_entries'][:10]:  # Last 10 entries
                story.append(Paragraph(f"<b>{j['title']}</b> - {j['entry_date'][:10] if j['entry_date'] else 'N/A'}", body_style))
                content_preview = j['content'][:200] + "..." if len(j['content']) > 200 else j['content']
                story.append(Paragraph(content_preview, body_style))
                story.append(Spacer(1, 10))
        
        # Build PDF
        doc.build(story)
        
        # Get PDF bytes
        pdf_bytes = buffer.getvalue()
        buffer.close()
        
        logger.info(f"PDF export complete for user {user_id}: {len(pdf_bytes)} bytes")
        
        # In production, you would upload this to S3 or similar
        # For now, return metadata
        return {
            "status": "success",
            "size_bytes": len(pdf_bytes),
            "counts": json_result["counts"],
        }
        
    except Exception as e:
        logger.exception(f"PDF export failed for user {user_id}: {e}")
        return {"status": "error", "message": str(e)}
