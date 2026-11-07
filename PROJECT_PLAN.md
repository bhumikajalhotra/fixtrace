# FixTrace — Project Plan

## Overview
FixTrace is an AI-powered incident response assistant that uses **Hindsight** as a core persistent memory layer. It recalls similar historical incidents, recommends fixes, and improves over time via retain/recall — not model retraining.

## Architecture
- **Frontend**: React (Vite) — Dashboard, New Incident, Analytics, AI Chat
- **Backend**: Python/FastAPI — API layer, LLM orchestration, Hindsight integration
- **LLM**: Groq (OpenAI-compatible) — `openai/gpt-oss-120b`
- **Memory**: Hindsight (embedded server w/ pg0) — retain/recall/reflect
- **Storage**: Hindsight is the system of record for incidents; SQLite for app metadata (users, settings)

## Folder Structure
```
FixTrace/
├── backend/
│   ├── main.py            # FastAPI app + routes
│   ├── hindsight_svc.py   # Hindsight retain/recall wrapper
│   ├── llm_svc.py         # Groq LLM calls
│   ├── models.py          # Pydantic schemas
│   ├── seed_data.py       # Synthetic incidents
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/         # Dashboard, NewIncident, Analytics, Chat
│   │   └── components/
│   └── package.json
└── PROJECT_PLAN.md
```

## Hindsight Integration
- Bank id: `fixtrace-incidents`, mission: "Remember production incidents, root causes, fixes, outcomes."
- **retain**: Called when an incident is resolved (stores verified facts: title, root cause, fix, outcome, tags).
- **recall**: Called on new incident intake (semantic search) and chat queries.
- **reflect**: Used for analytics summaries ("most common failures").
- Memory is distinct from app DB: app DB stores UI state; Hindsight stores semantic incident knowledge.

## Data Schema (Incident)
```
incident_id, title, description, logs, severity, status,
root_cause (verified|ai_hypothesis), fix_applied, outcome (resolved|failed|open),
tags: [category, service], created_at, resolved_at
```

## API Endpoints
- POST /api/incidents — create + recall similar + LLM analysis
- POST /api/incidents/{id}/resolve — mark resolved, retain to Hindsight
- GET  /api/incidents — list
- POST /api/recall — semantic recall
- POST /api/chat — chat with memory
- GET  /api/analytics — categories, recurrence, recommendations

## Verified vs AI Hypothesis
- Each incident field has `source`: "verified" (engineer-confirmed) or "ai_hypothesis".
- UI badges distinguish. Recall results include source tags.

## User Journey
1. Engineer opens Dashboard → sees metrics + recent incidents.
2. New Incident → paste logs → FixTrace recalls similar past incidents + LLM runbook.
3. Engineer applies fix → marks Resolved → retained to Hindsight.
4. Analytics → recurring categories, recommendations.
5. Chat → ask about history.

## Security
- API keys via env vars (GROQ_API_KEY). Never committed.
- Hindsight runs embedded locally (no cloud key needed for demo).
- CORS restricted to frontend origin.

## Testing
- Manual: seed 3 incidents, verify recall returns relevant memory.
- Verify second similar incident gets better runbook than first.
- Chat returns grounded answers.

## Deployment
- Backend: Render/Railway (free). Frontend: Vercel.
- For hackathon: run locally with `uvicorn` + `npm run dev`.

## MVP Sequence (2-person, beginner)
1. Day1: Scaffold backend + Hindsight embedded + seed data + /recall
2. Day1: Frontend scaffold + Dashboard + New Incident
3. Day2: Resolve flow + retain + Analytics + Chat
4. Day2: Polish UI, demo scenarios, README/video
```

## Recommended Architecture
FastAPI backend wrapping Hindsight embedded server + Groq. React frontend via Vite. Hindsight is the persistent memory; SQLite for app state.

## Exact Implementation Sequence
1. Install deps (fastapi, uvicorn, groq, hindsight, python-dotenv)
2. Backend: Hindsight service (create bank, retain, recall, reflect)
3. Seed 3 synthetic incidents on startup
4. Endpoints: incidents CRUD, recall, chat, analytics
5. Frontend: Vite + React Router + pages
6. Wire frontend to backend
7. Test memory improvement across incidents
8. Polish + demo

## API Keys / Accounts
- Groq API key (free): https://console.groq.com
- No Hindsight cloud account needed (embedded mode)
- Band AI Desktop (required by event): install per organizer instructions

## Blockers
- Hindsight embedded server requires network for LLM calls (Groq).
- Confirm Groq model availability (`openai/gpt-oss-120b`).
- Band AI Desktop installation steps from organizer (not publicly documented).
