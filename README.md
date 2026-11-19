# 🚀 FixTrace — AI-Powered Incident Response Assistant

**FixTrace** is an AI-powered DevOps incident response platform that helps engineering teams investigate production incidents, identify potential root causes, and recommend actionable fixes using historical incident knowledge.

Unlike traditional AI assistants that start from scratch every time, FixTrace uses **Hindsight as a persistent memory layer** to recall similar past incidents, learn from verified resolutions, and make future recommendations more context-aware.

The goal is simple: **Solve incidents faster by remembering what went wrong and how it was fixed before.**

---

## ✨ Key Features

### 1. AI-Powered Incident Investigation
- Submit new production incidents with titles, descriptions, and error logs.
- Analyze incidents using an LLM powered by Groq.
- Generate actionable investigation runbooks.
- Identify possible root causes, immediate mitigation steps, permanent fixes, and verification steps.

### 2. Persistent Memory with Hindsight
- Recalls similar historical incidents using semantic search.
- Stores resolved incidents, root causes, applied fixes, and outcomes.
- Uses historical knowledge to improve recommendations for future incidents.
- Maintains memory across different investigations.

### 3. Incident Management
- Create and track production incidents.
- Monitor incident severity and status.
- Record verified root causes and applied solutions.
- Distinguish between AI-generated hypotheses and engineer-verified information.

### 4. Intelligent Analytics
- View total, open, and resolved incidents.
- Analyze recurring incident categories and affected services.
- Generate AI-powered summaries of historical failures.
- Identify patterns and potential preventive actions.

### 5. AI Incident Chat
- Ask questions about historical incidents.
- Retrieve relevant information from Hindsight memory.
- Get context-aware answers based on previously recorded incident knowledge.
- Distinguish verified information from AI hypotheses.

---

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Tailwind CSS, CSS |
| Backend | Python, FastAPI |
| AI / LLM | Groq API, GPT-OSS-120B |
| Persistent Memory | Hindsight |
| Memory Model | Ollama, Llama 3.2 |
| Data Storage | JSON |
| API Communication | REST API, Fetch API |
| Data Validation | Pydantic |

---

## 🏗️ System Architecture

FixTrace follows a frontend-backend architecture with an AI orchestration layer and a persistent memory system.

```text
                 ┌──────────────────────┐
                 │     React Frontend   │
                 │                      │
                 │  Dashboard           │
                 │  New Incident        │
                 │  Analytics           │
                 │  AI Chat             │
                 └──────────┬───────────┘
                            │
                       REST API
                            │
                 ┌──────────▼───────────┐
                 │    FastAPI Backend   │
                 │                      │
                 │  Incident Management │
                 │  API Endpoints       │
                 │  AI Orchestration    │
                 └──────┬────────┬──────┘
                        │        │
              ┌─────────▼───┐  ┌─▼──────────────┐
              │  Groq API   │  │   Hindsight    │
              │             │  │                │
              │ GPT-OSS-120B│  │ Recall         │
              │             │  │ Retain         │
              │ AI Analysis │  │ Reflect        │
              │ AI Chat     │  │                │
              └─────────────┘  └───────┬────────┘
                                       │
                                ┌──────▼──────┐
                                │   Ollama    │
                                │  Llama 3.2  │
                                └─────────────┘
```

### How It Works

1. **Incident Intake:** An engineer submits a production incident along with its description and logs.
2. **Memory Recall:** FixTrace searches Hindsight for similar historical incidents.
3. **AI Investigation:** Groq analyzes the new incident using the retrieved historical context.
4. **Resolution:** The engineer investigates the recommendations and records the actual root cause and fix.
5. **Memory Retention:** The resolved incident is stored in Hindsight for future reference.
6. **Continuous Improvement:** Future investigations can retrieve previously stored knowledge and benefit from past resolutions.

---

## 📂 Project Structure

```text
FixTrace/
│
├── backend/
│   ├── main.py             # FastAPI application and API routes
│   ├── hindsight_svc.py    # Hindsight memory integration
│   ├── llm_svc.py          # Groq LLM integration
│   ├── models.py           # Pydantic data models
│   ├── seed_data.py        # Initial sample incident data
│   ├── incidents.json      # Incident records
│   ├── audit.json          # Incident resolution audit records
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main application
│   │   ├── Dashboard.jsx   # Incident dashboard
│   │   ├── NewIncident.jsx # Incident investigation interface
│   │   ├── Analytics.jsx   # Incident analytics
│   │   ├── Chat.jsx        # AI-powered incident chat
│   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .env.example
└── README.md
```

---

## ⚙️ Installation and Setup

Follow these steps to run FixTrace locally.

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js and npm
- Git
- Ollama
- A Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/Krishna-12-git/fixtrace.git

cd fixtrace
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment:

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from:

https://console.groq.com/

### 4. Set Up Ollama and Hindsight

FixTrace uses Ollama to support the Hindsight memory system.

Install Ollama from:

https://ollama.com/

Pull the required model:

```bash
ollama pull llama3.2
```

Make sure the Ollama service is running before starting the backend.

Hindsight runs through its embedded server and uses Ollama for its memory operations.

### 5. Start the Backend Server

From the `backend` directory, run:

```bash
uvicorn main:app --reload
```

The backend will start at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

### 6. Configure and Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

**FixTrace is now ready to use!**

---

## 🔌 API Endpoints

The FastAPI backend provides the following REST API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/incidents` | Retrieve all incidents |
| POST | `/api/incidents` | Create and investigate an incident |
| POST | `/api/incidents/{id}/resolve` | Resolve an incident and retain its knowledge |
| POST | `/api/recall` | Search historical incident memory |
| POST | `/api/chat` | Ask questions using historical memory |
| GET | `/api/analytics` | Retrieve incident analytics and AI summaries |

Interactive API documentation is available through FastAPI Swagger UI at `/docs`.

---

## 🧠 What Makes FixTrace Different?

Traditional incident management systems primarily store incident records for engineers to review manually.

FixTrace introduces a persistent AI memory approach.

| Traditional Approach | FixTrace |
|---|---|
| Engineers manually search old incidents | AI-powered semantic memory recall |
| Every investigation starts with limited context | Historical incidents provide additional context |
| Solutions remain in separate records | Resolutions are retained in persistent memory |
| Limited automated pattern discovery | AI-assisted analytics and reflection |
| Generic AI recommendations | Recommendations informed by historical incidents |

### Verified Facts vs AI Hypotheses

FixTrace distinguishes between two types of incident knowledge:

- **AI Hypothesis:** Potential root causes and recommendations generated by the AI.
- **Verified:** Root causes and fixes confirmed by engineers.

This distinction helps prevent AI-generated suggestions from being treated as confirmed incident facts.

---

## 🔮 Future Enhancements

- Real-time monitoring and automated incident detection.
- Integration with monitoring platforms such as Prometheus and Grafana.
- Slack and Microsoft Teams incident notifications.
- Automated log analysis and anomaly detection.
- Role-based authentication and access control.
- Deployment support for cloud environments.
- Advanced incident correlation and predictive failure analysis.

---

## 🎯 Project Objective

FixTrace aims to reduce incident resolution time by transforming historical production failures into reusable operational knowledge.

By combining Large Language Models with persistent AI memory, it helps engineering teams move beyond repeatedly solving the same problems and toward a smarter, memory-driven incident response workflow.

---

## 👨‍💻 Author

**Krishna Gupta**

- GitHub: [Krishna-12-git](https://github.com/Krishna-12-git)
- Project Repository: [FixTrace](https://github.com/Krishna-12-git/fixtrace)

---

⭐ If you find this project interesting, consider giving the repository a star!
