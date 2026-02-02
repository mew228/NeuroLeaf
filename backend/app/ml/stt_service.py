from openai import OpenAI
from app.config import get_settings
import os
import tempfile

settings = get_settings()

class STTService:
    """Service for Speech-to-Text using OpenAI Whisper."""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "whisper-1"
    
    def transcribe(self, audio_file_path: str) -> str:
        """
        Transcribe audio file to text.
        
        Args:
            audio_file_path: Path to the audio file
            
        Returns:
            str: Transcribed text
        """
        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model=self.model, 
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            print(f"Error during transcription: {e}")
            return f"Transcribing failed: {str(e)}"

# Singleton instance
stt_service = STTService()
