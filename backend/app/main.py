from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api.v1 import api_router

settings = get_settings()

app = FastAPI(
    title="NeuroLeaf API",
    description="AI-Powered Mental Wellness Companion - Ethical, Privacy-First Journaling & Mood Tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "NeuroLeaf API",
        "version": "1.0.0",
        "description": "AI-Powered Mental Wellness Companion",
        "disclaimer": "⚠️ NeuroLeaf is a mood tracking and journaling tool. NOT a substitute for professional mental health care.",
        "documentation": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
