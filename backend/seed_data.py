import json, os, uuid
from datetime import datetime, timedelta

def seed():
    if os.path.exists("incidents.json"):
        os.remove("incidents.json")
    data = [
        {"title":"Redis OOM Crash","description":"Redis node crashed due to out-of-memory, evicting keys","logs":"OOM command not allowed when used memory > 'maxmemory'","severity":"high","category":"database","service":"redis-cache"},
        {"title":"Payment Gateway API Timeout","description":"Payment API returning 504 after deployment","logs":"FATAL: sorry, too many clients already","severity":"high","category":"database","service":"payment-api"},
        {"title":"API Gateway 502 Bad Gateway","description":"Upstream connection refused during peak traffic","logs":"connect() failed (111: Connection refused)","severity":"high","category":"networking","service":"api-gateway"},
        {"title":"Auth Service JWT Validation Failure","description":"Users unable to login, token validation errors","logs":"jwt: invalid signature","severity":"medium","category":"auth","service":"auth-service"},
        {"title":"Kubernetes Pod CrashLoopBackOff","description":"Worker pods restarting repeatedly","logs":"CrashLoopBackOff","severity":"medium","category":"orchestration","service":"worker"},
        {"title":"Postgres Connection Pool Exhaustion","description":"DB connections maxed out","logs":"FATAL: sorry, too many clients already","severity":"high","category":"database","service":"postgres"},
        {"title":"CDN Cache Invalidation Failure","description":"Stale assets served after deploy","logs":"cache miss ratio 98%","severity":"low","category":"cdn","service":"cdn"},
        {"title":"Message Queue Backlog","description":"RabbitMQ queue depth growing","logs":"queue depth 50000","severity":"medium","category":"messaging","service":"rabbitmq"},
    ]
    incs = []
    for i, d in enumerate(data):
        iid = str(uuid.uuid4())[:8]
        resolved = i % 2 == 0
        inc = {"incident_id": iid, **d, "status": "resolved" if resolved else "open",
               "root_cause": "Resource exhaustion" if resolved else None,
               "fix_applied": "Scaled resources and restarted" if resolved else None,
               "outcome": "resolved" if resolved else "open", "source": "verified",
               "created_at": (datetime.utcnow()-timedelta(days=i+1)).isoformat(),
               "resolved_at": (datetime.utcnow()-timedelta(days=i)).isoformat() if resolved else None,
               "similar": []}
        incs.append(inc)
    json.dump(incs, open("incidents.json","w"), indent=2)
    from hindsight_svc import get_client, aretain_incident
    import asyncio
    get_client()
    async def run():
        for inc in incs:
            if inc["status"]=="resolved":
                try:
                    await aretain_incident(inc)
                except Exception as e:
                    print("retain err", e)
    asyncio.run(run())
    print("seeded", len(incs))

if __name__ == "__main__":
    seed()
