import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const API = 'http://localhost:8000';
const card = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, marginBottom: 16 };
const btn = { padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'transform .15s' };
const input = { width: '100%', padding: 10, marginBottom: 10, background: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: 8, fontSize: 14 };

export default function NewIncident() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resolveRoot, setResolveRoot] = useState("");
  const [resolveFix, setResolveFix] = useState("");
  const [resolvedMsg, setResolvedMsg] = useState("");
  const submit = async () => {
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/incidents`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, description: desc, logs, severity: "high", category: "database", service: "payment-api" }) });
      setResult(await r.json());
    } finally { setLoading(false); }
  };
  const markResolved = async () => {
    if (!result?.incident_id) return;
    await fetch(`${API}/api/incidents/${result.incident_id}/resolve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ root_cause: resolveRoot, fix_applied: resolveFix, outcome: "resolved", source: "verified" }) });
    setResolvedMsg("✅ Saved to Hindsight memory. Agent learned this fix.");
  };
  return (
    <div className="grid grid-cols-2 gap-6">
      <div style={card}>
        <h2 className="text-2xl font-bold mb-4">🚨 New Incident Intake</h2>
        <input placeholder="Incident title" value={title} onChange={e => setTitle(e.target.value)} style={input} />
        <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} style={input} rows={3} />
        <textarea placeholder="Paste logs here..." value={logs} onChange={e => setLogs(e.target.value)} style={input} rows={5} />
        <button onClick={submit} disabled={loading} style={{ ...btn, width: "100%", opacity: loading ? 0.6 : 1 }}>
          {loading ? "🔍 Investigating..." : "Run AI Investigation"}
        </button>
      </div>
      <div style={card}>
        {result ? (
          <>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">🧠 Recalled from Hindsight Memory</h3>
            {result.similar?.length ? result.similar.map((m, i) => (
              <div key={i} className="p-3 bg-black/30 rounded-lg mb-2 border-l-2 border-purple-500">• {m.text}</div>
            )) : <p className="text-gray-500">No prior incidents found.</p>}
            <h3 className="text-lg font-semibold text-green-400 mt-4 mb-2">📋 Suggested Fix / Runbook</h3>
            <div className="prose prose-invert max-w-none bg-black/30 p-4 rounded-lg">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.analysis}</ReactMarkdown>
            </div>
            <div className="mt-4 p-4 bg-black/30 rounded-lg border border-white/10">
              <input placeholder="Verified root cause" value={resolveRoot} onChange={e => setResolveRoot(e.target.value)} style={input} />
              <input placeholder="Fix applied" value={resolveFix} onChange={e => setResolveFix(e.target.value)} style={input} />
              <button onClick={markResolved} style={{ ...btn, background: "linear-gradient(135deg,#8b5cf6,#ec4899)", width: "100%", padding: 14, fontSize: 15 }}>
                💾 Mark Resolved & Save to Memory
              </button>
              {resolvedMsg && <p className="text-green-400 mt-2">{resolvedMsg}</p>}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Run an investigation to see AI response here.</p>
        )}
      </div>
    </div>
  );
}
