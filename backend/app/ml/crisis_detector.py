import re


class CrisisDetector:
    """Detect crisis language in journal entries with escalating severity levels."""
    
    # High-severity keywords indicating immediate crisis
    HIGH_RISK_KEYWORDS = [
        'suicide', 'suicidal', 'kill myself', 'end my life', 'end it all',
        'better off dead', 'want to die', 'going to kill',
        'self-harm', 'cutting myself', 'hurt myself', 'harm myself',
        'no reason to live', 'can\'t go on', 'goodbye forever',
        'planning to die', 'take my life'
    ]
    
    # Moderate-risk patterns requiring attention
    MODERATE_RISK_PATTERNS = [
        r'\bdon\'t want to (be here|exist|wake up|live)\b',
        r'\btired of (living|everything|life|trying to live)\b',
        r'\beveryone (would be better|better off) without me\b',
        r'\bno point in (anything|continuing|trying|living)\b',
        r'\bcan\'t take (it|this) anymore\b',
        r'\bgive up on (everything|life)\b',
        r'\bhopeless(ness)?.*\b(forever|always|never)\b',
        r'\bnothing (matters|will help|can help)\b'
    ]
    
    # Stress keywords for tracking (not crisis)
    STRESS_KEYWORDS = [
        'stress', 'stressed', 'overwhelmed', 'anxious', 'anxiety',
        'pressure', 'burden', 'exhausted', 'tired', 'worried',
        'deadline', 'workload', 'busy', 'hectic'
    ]
    
    def detect(self, text: str) -> dict:
        """
        Detect crisis language and stress patterns.
        
        Returns:
            dict: {
                'crisis_detected': bool,
                'severity': str ('none', 'moderate', 'severe'),
                'detected_patterns': list,
                'stress_keywords': list,
                'stress_level': str ('low', 'moderate', 'high')
            }
        """
        text_lower = text.lower()
        detected_patterns = []
        stress_keywords_found = []
        
        # Check high-risk keywords
        for keyword in self.HIGH_RISK_KEYWORDS:
            if keyword in text_lower:
                detected_patterns.append(keyword)
        
        # If high-risk detected, immediate severe crisis
        if detected_patterns:
            return {
                'crisis_detected': True,
                'severity': 'severe',
                'detected_patterns': detected_patterns,
                'stress_keywords': [],
                'stress_level': 'high'
            }
        
        # Check moderate-risk patterns
        for pattern in self.MODERATE_RISK_PATTERNS:
            if re.search(pattern, text_lower, re.IGNORECASE):
                match = re.search(pattern, text_lower, re.IGNORECASE)
                detected_patterns.append(match.group(0))
        
        # If moderate risk detected
        if detected_patterns:
            return {
                'crisis_detected': True,
                'severity': 'moderate',
                'detected_patterns': detected_patterns,
                'stress_keywords': [],
                'stress_level': 'high'
            }
        
        # Check stress keywords
        for keyword in self.STRESS_KEYWORDS:
            pattern = r'\b' + re.escape(keyword) + r'\b'
            if re.search(pattern, text_lower):
                stress_keywords_found.append(keyword)
        
        # Determine stress level
        stress_count = len(stress_keywords_found)
        if stress_count >= 5:
            stress_level = 'high'
        elif stress_count >= 2:
            stress_level = 'moderate'
        else:
            stress_level = 'low'
        
        return {
            'crisis_detected': False,
            'severity': 'none',
            'detected_patterns': [],
            'stress_keywords': stress_keywords_found,
            'stress_level': stress_level
        }


# Singleton instance
crisis_detector = CrisisDetector()
