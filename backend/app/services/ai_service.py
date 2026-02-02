from sqlalchemy.ext.asyncio import AsyncSession
from app.models.journal import JournalEntry
from app.models.analysis import AIAnalysis
from app.models.crisis import CrisisLog
from app.ml import (
    sentiment_analyzer,
    emotion_classifier,
    crisis_detector,
    reflection_generator
)


class AIService:
    """Service for AI analysis of journal entries."""
    
    @staticmethod
    async def analyze_journal_entry(
        journal_entry: JournalEntry,
        db: AsyncSession
    ) -> AIAnalysis:
        """
        Perform complete AI analysis on a journal entry.
        
        Args:
            journal_entry: JournalEntry instance
            db: Database session
        
        Returns:
            AIAnalysis instance
        """
        content = journal_entry.content
        
        # 1. Sentiment Analysis
        sentiment_result = sentiment_analyzer.analyze(content)
        
        # 2. Emotion Classification
        emotion_result = emotion_classifier.analyze(content)
        
        # 3. Crisis Detection
        crisis_result = crisis_detector.detect(content)
        
        # 4. Generate AI Reflection (unless crisis)
        reflection_result = reflection_generator.generate(
            journal_content=content,
            primary_emotion=emotion_result['primary'],
            sentiment_label=sentiment_result['label'],
            stress_level=crisis_result['stress_level'],
            crisis_detected=crisis_result['crisis_detected']
        )
        
        # 5. Create AI Analysis record
        analysis = AIAnalysis(
            user_id=journal_entry.user_id,
            journal_id=journal_entry.id,
            
            # Sentiment
            sentiment_score=sentiment_result['score'],
            sentiment_label=sentiment_result['label'],
            
            # Emotion
            primary_emotion=emotion_result['primary'],
            emotion_scores=emotion_result['scores'],
            
            # Stress
            stress_level=crisis_result['stress_level'],
            stress_keywords=crisis_result['stress_keywords'],
            
            # Reflection
            ai_reflection=reflection_result['reflection'],
            reflection_tone=reflection_result['tone'],
            
            # Crisis
            crisis_detected=crisis_result['crisis_detected'],
            crisis_severity=crisis_result['severity'],
            
            model_version=reflection_result['model_version']
        )
        
        db.add(analysis)
        
        # 6. Log crisis if detected
        if crisis_result['crisis_detected']:
            crisis_log = CrisisLog(
                user_id=journal_entry.user_id,
                journal_id=journal_entry.id,
                analysis_id=analysis.id,
                detected_patterns=crisis_result['detected_patterns'],
                severity_level=crisis_result['severity'],
                flagged_content=content[:100] + "...",  # Redacted excerpt
                resources_shown=[
                    "National Suicide Prevention Lifeline: 988",
                    "Crisis Text Line: Text HOME to 741741"
                ]
            )
            db.add(crisis_log)
        
        await db.commit()
        await db.refresh(analysis)
        
        return analysis


# Singleton instance
ai_service = AIService()
