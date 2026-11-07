import os
from hindsight import HindsightServer, HindsightClient

BANK_ID = "fixtrace-incidents"

_server = None
_client = None

def get_client():
    global _server, _client
    if _client is None:
        _server = HindsightServer(
            llm_provider="ollama",
            llm_model="llama3.2",
            llm_api_key="ollama",
        )
        _server.start(timeout=120)
        _client = HindsightClient(base_url=_server.url)
        try:
            _client.banks.create(
                bank_id=BANK_ID,
                name="FixTrace Incident Memory",
                mission="Remember production incidents, root causes, fixes, and outcomes.",
            )
        except Exception:
            pass
    return _client

async def arecall_similar(query: str, top_k: int = 5):
    client = get_client()
    res = await client.arecall(bank_id=BANK_ID, query=query, budget="mid")
    out = []
    for r in getattr(res, "results", []) or []:
        out.append({"text": getattr(r, "text", str(r)), "score": getattr(r, "score", None)})
    return out[:top_k]

async def aretain_incident(incident: dict):
    client = get_client()
    content = (
        f"Incident: {incident['title']}. "
        f"Description: {incident['description']}. "
        f"Logs: {incident.get('logs','')}. "
        f"Root cause: {incident.get('root_cause','unknown')}. "
        f"Fix applied: {incident.get('fix_applied','none')}. "
        f"Outcome: {incident.get('outcome','unknown')}. "
        f"Category: {incident.get('category','other')}. Service: {incident.get('service','unknown')}."
    )
    return await client.aretain(
        bank_id=BANK_ID,
        content=content,
        context="incident resolution",
        tags=[incident.get("category","other"), incident.get("service","unknown"), incident.get("outcome","unknown"), incident.get("severity","medium")],
        metadata={"incident_id": incident["incident_id"], "source": incident.get("source","verified")},
    )

async def areflect_summary(query: str):
    client = get_client()
    try:
        r = await client.areflect(bank_id=BANK_ID, query=query)
        return getattr(r, "text", str(r))
    except Exception as e:
        return f"Reflect unavailable: {e}"
