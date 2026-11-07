from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class IncidentIn(BaseModel):
    title: str
    description: str
    logs: str = ""
    severity: str = "medium"
    category: str = "other"
    service: str = "unknown"

class ResolveIn(BaseModel):
    root_cause: str
    fix_applied: str
    outcome: str = "resolved"  # resolved | failed | partial
    source: str = "verified"   # verified | ai_hypothesis

class Incident(BaseModel):
    incident_id: str
    title: str
    description: str
    logs: str = ""
    severity: str = "medium"
    category: str = "other"
    service: str = "unknown"
    status: str = "open"
    root_cause: Optional[str] = None
    fix_applied: Optional[str] = None
    outcome: Optional[str] = None
    source: str = "ai_hypothesis"
    created_at: str
    resolved_at: Optional[str] = None
    similar: List[dict] = []

class ChatIn(BaseModel):
    question: str

class RecallIn(BaseModel):
    query: str
    top_k: int = 5
