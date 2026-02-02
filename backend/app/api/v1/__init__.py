from fastapi import APIRouter
from app.api.v1 import auth, mood, journal, crisis, analysis

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(mood.router)
api_router.include_router(journal.router)
api_router.include_router(crisis.router)
api_router.include_router(analysis.router)
