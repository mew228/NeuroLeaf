# NeuroLeaf Backend

## Setup Instructions

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- pip and virtualenv

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Create PostgreSQL database:**
```sql
CREATE DATABASE neuroleaf_db;
CREATE USER neuroleaf_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE neuroleaf_db TO neuroleaf_user;
```

5. **Run database migrations:**
```bash
alembic upgrade head
```

6. **Start the server:**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### API Documentation
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Testing
```bash
pytest
```

## Project Structure
```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── config.py            # Environment configuration
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── api/v1/              # API routes
│   ├── services/            # Business logic
│   ├── ml/                  # AI/ML pipeline
│   ├── middleware/          # Custom middleware
│   └── utils/               # Helper functions
├── alembic/                 # Database migrations
├── requirements.txt
└── .env.example
```

## Environment Variables

See `.env.example` for all required environment variables.
