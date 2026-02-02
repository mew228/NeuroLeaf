from fastapi import APIRouter

router = APIRouter(prefix="/crisis", tags=["Crisis Resources"])


@router.get("/resources", response_model=dict)
async def get_crisis_resources():
    """Get crisis resources and hotline information."""
    return {
        "message": "We care about your well-being",
        "disclaimer": "NeuroLeaf is not a substitute for professional help.",
        "resources": [
            {
                "name": "National Suicide Prevention Lifeline (US)",
                "phone": "988",
                "available": "24/7"
            },
            {
                "name": "Crisis Text Line",
                "text": "Text HOME to 741741",
                "available": "24/7"
            },
            {
                "name": "International Association for Suicide Prevention",
                "website": "https://www.iasp.info/resources/Crisis_Centres/"
            },
            {
                "name": "SAMHSA National Helpline",
                "phone": "1-800-662-4357",
                "available": "24/7",
                "description": "Substance abuse and mental health services"
            }
        ]
    }
