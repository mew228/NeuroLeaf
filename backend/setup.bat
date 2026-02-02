@echo off
echo ====================================
echo NeuroLeaf Backend Setup
echo ====================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if errorlevel 1 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created
echo.

echo Step 2: Installing dependencies...
venv\Scripts\pip.exe install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

echo Step 3: Checking PostgreSQL...
echo.
echo PostgreSQL must be installed and running.
echo.
echo IMPORTANT: Before continuing, please:
echo 1. Open PostgreSQL (pgAdmin or psql)
echo 2. Run these commands:
echo.
echo    CREATE DATABASE neuroleaf_db;
echo    CREATE USER neuroleaf_user WITH PASSWORD 'neuroleaf2026';
echo    GRANT ALL PRIVILEGES ON DATABASE neuroleaf_db TO neuroleaf_user;
echo.
pause
echo.

echo Step 4: Running database migrations...
venv\Scripts\alembic.exe upgrade head
if errorlevel 1 (
    echo ERROR: Database migration failed
    echo Make sure PostgreSQL is running and credentials are correct
    pause
    exit /b 1
)
echo ✓ Database migrations completed
echo.

echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo To start the server, run:
echo    start_server.bat
echo.
echo Or manually:
echo    venv\Scripts\activate
echo    uvicorn app.main:app --reload
echo.
pause
