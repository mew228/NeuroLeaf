# 🌿 NeuroLeaf | AI Mental Health Companion

NeuroLeaf is a premium, AI-powered mental health application designed for deep emotional tracking, journaling, and neural synchronization. Built with a focus on modern aesthetics, performance, and mobile-first accessibility.

![Build Status](https://img.shields.io/badge/Build-Success-emerald)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20FastAPI%20|%20PostgreSQL-teal)

## ✨ Core Features

### 🌈 Neural Aura Background
A dynamic, mood-reactive background system that shifts gradients based on your emotional state. Optimized for 60fps performance on both desktop and mobile.

### 🧘 Neural Pulse (Breathing Guide)
An interactive, haptic-style breathing guide with three distinct phases (Inhale, Hold, Exhale) designed to help regulate your nervous system.

### 📝 Smart Journaling & AI Analysis
- **Insight Orbs:** AI-driven reflections that analyze your journal entries for sentiment, primary emotions, and stress levels.
- **Crisis Detection:** Real-time monitoring for high-risk language with immediate resource routing.
- **Focus Mode:** A distraction-free writing environment for deeper reflection.

### 📊 Emotional Dashboard
- **Mood History:** Visualized trends of your emotional well-being over time.
- **Activity Log:** Unified view of your recent reflections and neural patterns.
- **Quick Check-ins:** A 1-10 granular mood tracking system with smart upsert capabilities.

## 🛠️ Technology Stack

- **Frontend:** Next.js 15+, Tailwind CSS 4, Framer Motion (Animations), Lucide React (Icons).
- **Backend:** FastAPI (Python 3.11+), SQLAlchemy (Async), PostgreSQL.
- **Security:** JWT Authentication, Bcrypt password hashing.
- **AI Engine:** OpenAI GPT-4o Integration for sentiment and emotional analysis.

## 🚀 Getting Started

### Prerequisites
- Python 3.11 & Node.js 18+
- PostgreSQL 15+

### 1. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at [https://neuroleaf.vercel.app](https://neuroleaf.vercel.app).

## 📱 Mobile-First Design
NeuroLeaf features a custom-built mobile navigation bar with a central FAB (Floating Action Button) for instant mood logging. Every component is optimized for touch interaction and high-performance rendering on mobile GPUs.

---
*Built with ❤️ for better mental well-being.*
