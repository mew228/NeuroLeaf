from openai import OpenAI
from app.config import get_settings
from app.ml.prompts import REFLECTION_SYSTEM_PROMPT, create_reflection_prompt, CRISIS_RESPONSE_MESSAGE

settings = get_settings()


class ReflectionGenerator:
    """Generate AI reflections using OpenAI GPT with safety constraints."""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4"  # or gpt-3.5-turbo for cost savings
    
    def generate(
        self,
        journal_content: str,
        primary_emotion: str,
        sentiment_label: str,
        stress_level: str,
        crisis_detected: bool = False
    ) -> dict:
        """
        Generate AI reflection for journal entry.
        
        Args:
            journal_content: User's journal text
            primary_emotion: Detected primary emotion
            sentiment_label: Sentiment classification
            stress_level: Detected stress level
            crisis_detected: Whether crisis was detected
        
        Returns:
            dict: {
                'reflection': str,
                'tone': str ('supportive', 'encouraging', 'grounding'),
                'model_version': str
            }
        """
        # Override with crisis message if detected
        if crisis_detected:
            return {
                'reflection': CRISIS_RESPONSE_MESSAGE,
                'tone': 'crisis_response',
                'model_version': 'crisis_override'
            }
        
        try:
            # Create prompt
            user_prompt = create_reflection_prompt(
                journal_content=journal_content,
                primary_emotion=primary_emotion,
                sentiment_label=sentiment_label,
                stress_level=stress_level
            )
            
            # Call OpenAI API
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": REFLECTION_SYSTEM_PROMPT},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=150,
                temperature=0.7,
                presence_penalty=0.0,
                frequency_penalty=0.0
            )
            
            reflection = response.choices[0].message.content.strip()
            
            # Determine tone based on emotion and sentiment
            if sentiment_label == 'positive':
                tone = 'encouraging'
            elif stress_level == 'high' or sentiment_label == 'negative':
                tone = 'grounding'
            else:
                tone = 'supportive'
            
            return {
                'reflection': reflection,
                'tone': tone,
                'model_version': self.model
            }
        
        except Exception as e:
            # Fallback response if API fails
            return {
                'reflection': "Thank you for sharing your thoughts. Taking time to reflect through journaling is a valuable practice for self-awareness.",
                'tone': 'supportive',
                'model_version': f'fallback_error_{type(e).__name__}'
            }


# Singleton instance
reflection_generator = ReflectionGenerator()
