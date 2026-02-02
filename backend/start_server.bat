@echo off
echo Starting NeuroLeaf Backend Server...
echo.
echo Server will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.

venv\Scripts\uvicorn.exe app.main:app --reload --host 0.0.0.0 --port 8000
