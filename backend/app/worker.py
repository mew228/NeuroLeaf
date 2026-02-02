"""
Celery Application Configuration for NeuroLeaf
Handles background task processing for AI analysis, notifications, and reports.
"""


from celery import Celery
from celery.schedules import crontab
from app.config import get_settings

settings = get_settings()

# Initialize Celery app
celery_app = Celery(
    "neuroleaf",
    broker=getattr(settings, 'REDIS_URL', 'redis://localhost:6379/0'),
    backend=getattr(settings, 'REDIS_URL', 'redis://localhost:6379/0'),
    include=[
        "app.tasks.analysis_tasks",
        "app.tasks.notification_tasks",
        "app.tasks.trend_analysis",
        "app.tasks.export_tasks",
    ]
)

# Celery Configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes max per task
    task_soft_time_limit=240,  # Soft limit at 4 minutes
    worker_prefetch_multiplier=1,  # One task at a time per worker
    task_acks_late=True,  # Acknowledge after task completion
    task_reject_on_worker_lost=True,
)

# Scheduled Tasks (Celery Beat)
celery_app.conf.beat_schedule = {
    # Daily mood trend analysis at 9 AM UTC
    "daily-mood-trend-analysis": {
        "task": "app.tasks.trend_analysis.analyze_user_trends",
        "schedule": crontab(hour=9, minute=0),
    },
    # Weekly summary email every Sunday at 10 AM UTC
    "weekly-summary-email": {
        "task": "app.tasks.notification_tasks.send_weekly_summaries",
        "schedule": crontab(hour=10, minute=0, day_of_week=0),
    },
    # Cleanup old cache entries daily at 3 AM UTC
    "daily-cache-cleanup": {
        "task": "app.tasks.analysis_tasks.cleanup_stale_embeddings",
        "schedule": crontab(hour=3, minute=0),
    },
}

# Alias for imports
app = celery_app
