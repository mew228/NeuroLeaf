import re


class EmotionClassifier:
    """
    Rule-based emotion classification with keyword matching.
    
    For production, consider using HuggingFace models like:
    - cardiffnlp/twitter-roberta-base-emotion
    - j-hartmann/emotion-english-distilroberta-base
    """
    
    EMOTION_KEYWORDS = {
        'joy': ['happy', 'joyful', 'excited', 'thrilled', 'delighted', 'cheerful', 'wonderful', 'amazing', 'great'],
        'gratitude': ['grateful', 'thankful', 'blessed', 'appreciative', 'fortunate', 'lucky'],
        'calm': ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'content', 'comfortable'],
        'sadness': ['sad', 'unhappy', 'down', 'depressed', 'miserable', 'gloomy', 'heartbroken', 'lonely'],
        'anger': ['angry', 'mad', 'furious', 'frustrated', 'irritated', 'annoyed', 'rage'],
        'fear': ['afraid', 'scared', 'anxious', 'worried', 'nervous', 'fearful', 'terrified', 'panic'],
        'surprise': ['surprised', 'shocked', 'amazed', 'astonished', 'unexpected'],
        'disgust': ['disgusted', 'repulsed', 'revolted', 'sick'],
        'love': ['love', 'loving', 'adore', 'cherish', 'affection'],
        'hope': ['hopeful', 'optimistic', 'confident', 'encouraged']
    }
    
    def analyze(self, text: str) -> dict:
        """
        Classify emotions in text.
        
        Returns:
            dict: {
                'primary': str (emotion label),
                'scores': dict (emotion -> score)
            }
        """
        text_lower = text.lower()
        emotion_scores = {}
        
        # Count keyword matches
        for emotion, keywords in self.EMOTION_KEYWORDS.items():
            score = 0
            for keyword in keywords:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(keyword) + r'\b'
                matches = len(re.findall(pattern, text_lower))
                score += matches
            
            # Normalize by text length (rough approximation)
            word_count = len(text.split())
            normalized_score = score / max(word_count, 1) * 10
            emotion_scores[emotion] = min(round(normalized_score, 2), 1.0)
        
        # Find primary emotion
        if emotion_scores:
            primary_emotion = max(emotion_scores, key=emotion_scores.get)
            # If no emotions detected, default to 'neutral'
            if emotion_scores[primary_emotion] == 0:
                primary_emotion = 'neutral'
                emotion_scores['neutral'] = 0.5
        else:
            primary_emotion = 'neutral'
            emotion_scores['neutral'] = 0.5
        
        # Sort by score
        sorted_scores = dict(sorted(
            emotion_scores.items(),
            key=lambda x: x[1],
            reverse=True
        ))
        
        return {
            'primary': primary_emotion,
            'scores': {k: v for k, v in sorted_scores.items() if v > 0}
        }


# Singleton instance
emotion_classifier = EmotionClassifier()
