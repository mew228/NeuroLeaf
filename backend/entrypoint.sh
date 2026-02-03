#!/bin/bash

# Exit on error
set -e

echo "Starting NeuroLeaf Backend..."

# Run migrations
echo "Running database migrations..."
alembic upgrade head

# Start application
# PORT is provided by Render/Railway, default to 8000
PORT=${PORT:-8000}

echo "Starting Gunicorn on port $PORT..."
exec gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:$PORT \
    --access-logfile - \
    --error-logfile -
