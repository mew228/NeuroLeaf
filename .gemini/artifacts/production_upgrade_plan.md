# NeuroLeaf Production Upgrade Plan
## Enterprise Mental Health Platform Transformation

---

## Phase 1: Scalable Infrastructure & Reliability (Week 1-2)

### 1.1 Background Processing with Celery + Redis
**Status:** 🔄 In Progress

**Files to Create:**
- `backend/app/worker.py` - Celery application configuration
- `backend/app/tasks/analysis_tasks.py` - AI analysis background tasks
- `backend/app/tasks/notification_tasks.py` - Email/push notification tasks

**Dependencies:**
```txt
celery==5.3.6
redis==5.0.1
flower==2.0.1  # Celery monitoring
```

### 1.2 Redis Caching Layer
**Status:** 📋 Planned

**Implementation Points:**
- Cache dashboard summary (TTL: 5 minutes)
- Cache user mood history (TTL: 15 minutes)
- Cache AI embeddings lookup (TTL: 1 hour)

**Files to Create:**
- `backend/app/services/cache_service.py`

### 1.3 Docker Compose Multi-Stage Setup
**Status:** 📋 Planned

**Services:**
- `backend` - FastAPI with Gunicorn + Uvicorn workers
- `frontend` - Next.js with standalone build
- `postgres` - PostgreSQL 15 with health checks
- `redis` - Redis 7 for caching + Celery broker
- `celery-worker` - Background task processor
- `celery-beat` - Scheduled task scheduler

**Files to Create:**
- `docker-compose.yml`
- `docker-compose.prod.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`

### 1.4 CI/CD & Observability
**Status:** 📋 Planned

**GitHub Actions Workflows:**
- `.github/workflows/backend-ci.yml` - Pytest + Ruff linting
- `.github/workflows/frontend-ci.yml` - ESLint + TypeScript checks
- `.github/workflows/deploy.yml` - Production deployment

**Observability:**
- Sentry integration (frontend + backend)
- Structured logging with `structlog`

---

## Phase 2: Advanced AI & Insight Engine (Week 2-3)

### 2.1 Vector Database (ChromaDB)
**Status:** 📋 Planned

**Purpose:** Long-term emotional pattern recognition via RAG

**Files to Create:**
- `backend/app/services/vector_service.py`
- `backend/app/ml/embedding_generator.py`

**Capabilities:**
- Store journal entry embeddings
- Semantic search across past entries
- "What helped last time?" queries

### 2.2 Voice-to-Text (Whisper)
**Status:** ✅ Complete

Already implemented in `stt_service.py`.

### 2.3 Proactive Mood Trend Analysis
**Status:** 📋 Planned

**Logic:**
- Celery Beat scheduled task (runs daily at 9 AM)
- Detects 3+ consecutive days of declining mood scores
- Triggers push notification with breathing exercise link

**Files to Create:**
- `backend/app/tasks/trend_analysis.py`
- `backend/app/services/notification_service.py`

---

## Phase 3: Production-Grade Frontend (Week 3-4)

### 3.1 TanStack Query Migration
**Status:** 📋 Planned

**Benefits:**
- Automatic caching and background refetching
- Optimistic UI updates for instant feedback
- Proper loading/error states

**Files to Modify:**
- All pages using `api.get()` calls

### 3.2 Advanced Visualizations
**Status:** 📋 Planned

**New Charts:**
- Emotion Heatmap (day of week vs. time of day)
- Sleep-Mood Correlation Graph
- Stress Keyword Cloud

### 3.3 PWA Capabilities
**Status:** 📋 Planned

**Features:**
- Offline mood logging (IndexedDB)
- Install prompt for mobile
- Push notifications

**Files to Create:**
- `frontend/public/manifest.json`
- `frontend/public/service-worker.js`

### 3.4 Storybook Setup
**Status:** 📋 Planned

**Command:** `npx storybook@latest init`

---

## Phase 4: Security & Compliance (Week 4-5)

### 4.1 AES-256 Encryption at Rest
**Status:** 📋 Planned

**Strategy:**
- Generate per-user encryption keys (derived from password)
- Encrypt `journal.content` before database write
- Decrypt on read

**Files to Create:**
- `backend/app/services/encryption_service.py`

### 4.2 Refresh Token + MFA
**Status:** 📋 Planned

**Implementation:**
- Add `refresh_tokens` table
- TOTP-based MFA (Google Authenticator compatible)

### 4.3 Data Export (PDF/JSON)
**Status:** 📋 Planned

**Endpoints:**
- `GET /user/export/json`
- `GET /user/export/pdf`

**Libraries:**
- `reportlab` for PDF generation

---

## Implementation Priority Order

1. **Docker Compose** (Foundation for all other infra)
2. **Celery + Redis** (Unblocks background processing)
3. **ChromaDB Vector Store** (Enables RAG insights)
4. **TanStack Query** (Improves UX immediately)
5. **CI/CD Pipeline** (Ensures code quality)
6. **Encryption** (Security-critical)
7. **PWA + Storybook** (Polish)

---

## Current Session Progress

| Component | Status |
|-----------|--------|
| Voice Journaling (Whisper) | ✅ Complete |
| Docker Compose Setup | 🔄 In Progress |
| Celery Worker | 🔄 In Progress |
| Redis Cache | ⏳ Next |
