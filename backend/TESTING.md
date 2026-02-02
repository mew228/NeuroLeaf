# Backend Testing Guide

## ✅ Setup Progress

**Completed:**
- ✅ Virtual environment created
- ✅ Dependencies installing (this may take 5-10 minutes)
- ✅ Database migrations prepared
- ✅ Environment configuration ready
- ✅ Automated scripts created

## 📝 Next Steps

### 1. PostgreSQL Setup (Required)

You need PostgreSQL installed and running. If you don't have it:

**Download:** https://www.postgresql.org/download/windows/

After installation, create the database:

**Option A: Using pgAdmin (GUI)**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `neuroleaf_db`
5. In Query Tool, run:
```sql
CREATE USER neuroleaf_user WITH PASSWORD 'neuroleaf2026';
GRANT ALL PRIVILEGES ON DATABASE neuroleaf_db TO neuroleaf_user;
```

**Option B: Using Command Line**
```bash
createdb neuroleaf_db
psql -d neuroleaf_db
```
Then in psql:
```sql
CREATE USER neuroleaf_user WITH PASSWORD 'neuroleaf2026';
GRANT ALL PRIVILEGES ON DATABASE neuroleaf_db TO neuroleaf_user;
\q
```

### 2. Add OpenAI API Key (Optional but Recommended)

Edit `backend\.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get a key from: https://platform.openai.com/api-keys

**Without API key:** The app will work but use fallback messages instead of AI reflections.

### 3. Run Database Migrations

```bash
cd backend
venv\Scripts\alembic.exe upgrade head
```

This creates all the database tables.

### 4. Start the Server

```bash
cd backend
start_server.bat
```

Or manually:
```bash
venv\Scripts\uvicorn.exe app.main:app --reload
```

### 5. Test the API

Open your browser:
- **Swagger Docs:** http://localhost:8000/docs
- **API Root:** http://localhost:8000/

## 🧪 Quick Test Sequence

Once the server is running, use Swagger UI at http://localhost:8000/docs:

1. **POST /api/v1/auth/register** - Create an account
2. **POST /api/v1/auth/login** - Get your token
3. Click "Authorize" button (🔓) - Paste your token
4. **POST /api/v1/mood/entry** - Create a mood entry
5. **POST /api/v1/journal/entry** - Write a journal entry
6. **POST /api/v1/analysis/trigger/{journal_id}** - Trigger AI analysis
7. **GET /api/v1/analysis/{journal_id}** - View analysis results

## 🛠️ Troubleshooting

**Error: "Connection refused"**
- PostgreSQL is not running - start PostgreSQL service

**Error: "authentication failed"**
- Check database credentials in `.env` file

**Error: "ImportError" or "ModuleNotFoundError"**
- Dependencies still installing - wait a few minutes
- Or run: `venv\Scripts\pip.exe install -r requirements.txt`

**Error: "OpenAI API key"**
- Add your API key to `.env` file
- Or the app will use fallback responses (still works!)

## ✨ What to Test

**Authentication:**
- ✅ User registration
- ✅ Login with JWT tokens
- ✅ Protected routes require authentication

**Mood Tracking:**
- ✅ Create mood entries with scores 1-5
- ✅ Add emoji and notes
- ✅ View mood history

**Journaling:**
- ✅ Create journal entries
- ✅ View journal list
- ✅ Word count calculation

**AI Analysis:**
- ✅ Sentiment detection (positive/negative/neutral)
- ✅ Emotion classification (joy, sadness, anxiety, etc.)
- ✅ Stress level assessment
- ✅ AI reflection generation

**Crisis Detection (CRITICAL):**
Create a journal with text like:
```
"I feel hopeless and don't want to be here anymore. I'm thinking about ending it all."
```

Expected result:
- ✅ Crisis detected = true
- ✅ Crisis severity = "severe"
- ✅ AI reflection replaced with crisis resources
- ✅ Crisis log created in database

## 📊 Check Points

After testing, verify in Swagger docs:
- All endpoints return proper status codes (200, 201, 401, 404)
- Tokens work for authentication
- AI analysis completes without errors
- Crisis detection works correctly

## Need Help?

Check `QUICKSTART.md` for detailed curl examples and more info.

Once backend testing is complete, we'll build the frontend!
