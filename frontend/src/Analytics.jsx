import { useState, useEffect } from "react";
const API = "http://localhost:8000";
const card = { background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 20, marginBottom: 16 };

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`${API}/api/analytics`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        setAnalytics(await r.json());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  if (loading) return <div style={card}><p className="text-gray-400">Loading analytics...</p></div>;
  if (error) return <div style={card}><p className="text-red-400">Error: {error}</p></div>;
  if (!analytics) return <div style={card}><p className="text-gray-400">No data.</p></div>;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">📈 Executive Incident Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div style={card}>
          <h3 className="text-blue-400 mb-3">Most Common Root Causes</h3>
          {Object.entries(analytics.categories || {}).map(([k, v]) => {
            const total = analytics.total || 1;
            const pct = Math.round((v / total) * 100);
            return (
              <div key={k} className="mb-3">
                <div className="flex justify-between text-sm mb-1"><span>{k}</span><span className="text-gray-400">{v} ({pct}%)</span></div>
                <div className="w-full bg-gray-800 rounded h-2"><div className="bg-blue-500 h-2 rounded" style={{ width: pct + "%" }}></div></div>
              </div>
            );
          })}
        </div>
        <div style={card}>
          <h3 className="text-purple-400 mb-3">AI System Recommendations</h3>
          <ul className="text-sm space-y-2 text-gray-300">
            {Object.keys(analytics.categories || {}).slice(0, 3).map((c, i) => (
              <li key={i} className="flex gap-2"><span className="text-green-400">•</span> Consider proactive monitoring for <strong>{c}</strong> based on recurring failures.</li>
            ))}
            <li className="flex gap-2"><span className="text-green-400">•</span> Standardize rollout configs and add automated alerts at 75% capacity.</li>
          </ul>
        </div>
      </div>
      <div style={card}>
        <h3 className="text-green-400 mb-2">🤖 Hindsight Reflect Summary</h3>
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{analytics.ai_summary || "No summary available."}</pre>
      </div>
    </div>
  );
}
