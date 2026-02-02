# NeuroLeaf Backend - Quick Start Guide

## Prerequisites Check
Before starting, ensure you have:
- ✅ Python 3.11+ installed
- ✅ PostgreSQL 15+ installed and running
- ✅ OpenAI API key (optional for testing without AI reflections)

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL Database
Open PostgreSQL command line (psql) or pgAdmin and run:
```sql
CREATE DATABASE neuroleaf_db;
CREATE USER neuroleaf_user WITH PASSWORD 'neuroleaf2026';
GRANT ALL PRIVILEGES ON DATABASE neuroleaf_db TO neuroleaf_user;
```

### 3. Configure Environment Variables
The `.env` file has been created with default values. 

**IMPORTANT:** Add your OpenAI API key:
- Open `backend/.env`
- Replace `sk-your-openai-api-key-here` with your actual OpenAI API key
- If you don't have one, get it from: https://platform.openai.com/api-keys

**Note:** Without an OpenAI key, the app will still work but AI reflections will use fallback messages.

### 4. Run Database Migrations
```bash
alembic upgrade head
```

### 5. Start the Server
```bash
uvicorn app.main:app --reload
```

The server will start at: **http://localhost:8000**

## Testing the API

### Option 1: Swagger UI (Interactive)
Open your browser: **http://localhost:8000/docs**

You'll see all API endpoints with "Try it out" buttons.

### Option 2: Quick Test Flow

1. **Health Check**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Register a User**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@example.com\",\"password\":\"testpass123\",\"full_name\":\"Test User\"}"
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"test@example.com\",\"password\":\"testpass123\"}"
   ```
   
   Copy the `access_token` from the response.

4. **Create Mood Entry** (replace YOUR_TOKEN)
   ```bash
   curl -X POST http://localhost:8000/api/v1/mood/entry \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d "{\"mood_score\":4,\"mood_emoji\":\"😊\",\"mood_label\":\"content\",\"notes\":\"Had a good day\",\"entry_date\":\"2026-02-01\"}"
   ```

5. **Create Journal Entry**
   ```bash
   curl -X POST http://localhost:8000/api/v1/journal/entry \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d "{\"title\":\"My Day\",\"content\":\"Today was wonderful. I felt grateful for the sunshine and spent time with friends. Feeling hopeful about the future.\",\"entry_date\":\"2026-02-01\"}"
   ```
   
   Copy the `id` from the response.

6. **Trigger AI Analysis** (replace JOURNAL_ID)
   ```bash
   curl -X POST http://localhost:8000/api/v1/analysis/trigger/JOURNAL_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

7. **Get AI Analysis**
   ```bash
   curl http://localhost:8000/api/v1/analysis/JOURNAL_ID \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Test Crisis Detection

Create a journal entry with crisis keywords:
```bash
curl -X POST http://localhost:8000/api/v1/journal/entry \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Testing Crisis\",\"content\":\"I am feeling hopeless and don't want to be here anymore. Everything feels pointless.\",\"entry_date\":\"2026-02-01\"}"
```

Then trigger analysis - you should see crisis resources instead of AI reflection.

## Common Issues

### "Connection refused" error
- Make sure PostgreSQL is running
- Check database credentials in `.env`

### "Invalid API key" for OpenAI
- Verify your OpenAI API key is correct in `.env`
- Restart the server after changing `.env`

### Import errors
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt` again

## What to Look For

✅ **Working correctly if:**
- Registration and login return tokens
- Mood and journal entries save successfully
- AI analysis detects sentiment and emotions
- Crisis keywords trigger resource display (not AI reflection)
- All timestamps and user IDs are correct

## Next Steps

Once backend testing is complete:
- Review the AI analysis results
- Test different journal contents (positive, negative, crisis)
- Check the Swagger docs for all available endpoints
- Ready to build the frontend!
