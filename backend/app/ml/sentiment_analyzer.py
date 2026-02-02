from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class SentimentAnalyzer:
    """Sentiment analysis using VADER (Valence Aware Dictionary and sEntiment Reasoner)."""
    
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
    
    def analyze(self, text: str) -> dict:
        """
        Analyze sentiment of text.
        
        Returns:
            dict: {
                'score': float (-1.0 to 1.0),
                'label': str ('positive', 'negative', 'neutral')
            }
        """
        scores = self.analyzer.polarity_scores(text)
        compound_score = scores['compound']
        
        # Classify sentiment
        if compound_score >= 0.05:
            label = 'positive'
        elif compound_score <= -0.05:
            label = 'negative'
        else:
            label = 'neutral'
        
        return {
            'score': round(compound_score, 2),
            'label': label,
            'raw_scores': {
                'positive': round(scores['pos'], 2),
                'negative': round(scores['neg'], 2),
                'neutral': round(scores['neu'], 2)
            }
        }


# Singleton instance
sentiment_analyzer = SentimentAnalyzer()
