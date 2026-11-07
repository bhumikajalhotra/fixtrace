import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")


MODEL = "openai/gpt-oss-120b"

def get_client():
    return Groq(api_key=GROQ_API_KEY)

def analyze_incident(title, description, logs, memories):
    memory_ctx = "\n".join(f"- {m['text']}" for m in memories) if memories else "No prior incidents found."
    prompt = f"""You are FixTrace, an expert DevOps incident response agent.
Using the historical memory below (verified past incidents), provide a triage runbook for the new incident.

Historical Memory (Hindsight):
{memory_ctx}

New Incident:
Title: {title}
Description: {description}
Logs: {logs}

Provide: (1) Likely root causes (mark as AI hypothesis), (2) Immediate mitigation steps, (3) Permanent fix, (4) What to verify. Be concise and actionable."""
    r = get_client().chat.completions.create(messages=[{"role":"user","content":prompt}], model=MODEL)
    return r.choices[0].message.content

def chat(question, memories):
    memory_ctx = "\n".join(f"- {m['text']}" for m in memories) if memories else "No incidents in memory."
    prompt = f"""You are FixTrace. Answer the engineer's question using only the historical incident memory below. Distinguish verified facts from AI hypotheses. If unknown, say so.

Memory:
{memory_ctx}

Question: {question}"""
    r = get_client().chat.completions.create(messages=[{"role":"user","content":prompt}], model=MODEL)
    return r.choices[0].message.content
