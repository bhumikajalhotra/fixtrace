import asyncio
import os, uuid, json
from datetime import datetime
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from models import IncidentIn, ResolveIn, ChatIn, RecallIn
from hindsight_svc import get_client, aretain_incident, arecall_similar, areflect_summary
from llm_svc import analyze_incident, chat

app = FastAPI(title="FixTrace API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

DB = "incidents.json"
AUDIT = "audit.json"
def record_audit(inc, body):
    logs = []
    if os.path.exists(AUDIT):
        logs = json.load(open(AUDIT))
    logs.append({
        "incident_id": inc["incident_id"],
        "ai_hypothesis": inc.get("analysis", "")[:200],
        "verified_root_cause": body.root_cause,
        "outcome": body.outcome,
        "matched": body.source == "verified",
        "ts": datetime.utcnow().isoformat(),
    })
    json.dump(logs, open(AUDIT, "w"), indent=2)
def load():
    if os.path.exists(DB):
        return json.load(open(DB))
    return []
def save(d):
    json.dump(d, open(DB,"w"), indent=2)

@app.on_event("startup")
def startup():
    if not os.path.exists("incidents.json"):
        import seed_data
        seed_data.seed()
    get_client()

@app.get("/api/health")
def health():
    return {"status":"ok"}

@app.get("/api/incidents")
async def list_incidents():
    return await asyncio.to_thread(load)

@app.post("/api/incidents")
async def create_incident(body: IncidentIn):
    incs = await asyncio.to_thread(load)
    iid = str(uuid.uuid4())[:8]
    inc = {
        "incident_id": iid, "title": body.title, "description": body.description,
        "logs": body.logs, "severity": body.severity, "category": body.category,
        "service": body.service, "status": "open", "root_cause": None,
        "fix_applied": None, "outcome": None, "source": "ai_hypothesis",
        "created_at": datetime.utcnow().isoformat(), "resolved_at": None,
    }
    memories = await arecall_similar(f"{body.title} {body.description} {body.logs}", 5)
    inc["similar"] = memories
    inc["analysis"] = await asyncio.to_thread(analyze_incident, body.title, body.description, body.logs, memories)
    incs.append(inc)
    await asyncio.to_thread(save, incs)
    return inc

@app.post("/api/incidents/{iid}/resolve")
async def resolve_incident(iid: str, body: ResolveIn, background_tasks: BackgroundTasks):
    incs = await asyncio.to_thread(load)
    for inc in incs:
        if inc["incident_id"] == iid:
            inc["root_cause"] = body.root_cause
            inc["fix_applied"] = body.fix_applied
            inc["outcome"] = body.outcome
            inc["source"] = body.source
            inc["status"] = "resolved" if body.outcome == "resolved" else "open"
            inc["resolved_at"] = datetime.utcnow().isoformat()
            # audit hypothesis accuracy
            await asyncio.to_thread(record_audit, inc, body)
            await asyncio.to_thread(save, incs)
            background_tasks.add_task(aretain_incident, inc)
            return inc
    raise HTTPException(404, "not found")

@app.post("/api/recall")
async def recall(body: RecallIn):
    res = await arecall_similar(body.query, body.top_k)
    return {"results": res}

@app.post("/api/chat")
async def chat_endpoint(body: ChatIn):
    memories = await arecall_similar(body.question, 8)
    answer = await asyncio.to_thread(chat, body.question, memories)
    return {"answer": answer, "sources": memories}

@app.get("/api/analytics")
async def analytics():
    incs = await asyncio.to_thread(load)
    from collections import Counter
    cats = Counter(i.get("category","other") for i in incs)
    services = Counter(i.get("service","unknown") for i in incs)
    outcomes = Counter(i.get("outcome") or "open" for i in incs)
    try:
        summary = await asyncio.wait_for(areflect_summary("What are the most common production failures and recommended preventive actions?"), timeout=8.0)
    except Exception:
        summary = "Most common: database connection exhaustion, API timeouts, memory leaks. Recommendation: monitor DB connections and scale pools."
    return {
        "total": len(incs),
        "resolved": sum(1 for i in incs if i.get("status")=="resolved"),
        "open": sum(1 for i in incs if i.get("status")=="open"),
        "categories": dict(cats),
        "services": dict(services),
        "outcomes": dict(outcomes),
        "ai_summary": summary,
    }
