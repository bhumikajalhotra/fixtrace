import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const API = 'http://localhost:8000';
const card = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, marginBottom: 16 };
const btn = { padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'transform .15s' };
const input = { width: '100%', padding: 10, marginBottom: 10, background: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: 8, fontSize: 14 };

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        setIncidents(await (await fetch(`${API}/api/incidents`)).json());
        setAnalytics(await (await fetch(`${API}/api/analytics`)).json());
      } catch (e) { console.error(e); }
    })();
  }, []);
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome back, DevOps Team 👋</h2>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Incidents", value: analytics?.total ?? "—", color: "#58a6ff" },
          { label: "Resolved", value: analytics?.resolved ?? "—", color: "#3fb950" },
          { label: "Open", value: analytics?.open ?? "—", color: "#f85149" },
          { label: "Categories", value: Object.keys(analytics?.categories || {}).length, color: "#bc8cff" },
        ].map(m => (
          <div key={m.label} style={{ ...card, textAlign: "center" }}>
            <div className="text-xs text-gray-400 mb-1">{m.label}</div>
            <div className="text-3xl font-bold" style={{ color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      <h3 className="text-lg font-semibold mb-3">Recent Incidents</h3>
      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left text-gray-400">
              <th className="py-3 px-4">Title</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Severity</th><th className="py-3 px-4">Category</th><th className="py-3 px-4">Service</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(i => (
              <tr key={i.incident_id} className="border-t border-white/5 hover:bg-white/5 transition">
                <td className="py-3 px-4 font-medium">{i.title}</td>
                <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${i.status === "resolved" ? "bg-green-900/60 text-green-400" : "bg-red-900/60 text-red-400"}`}>{i.status.toUpperCase()}</span></td>
                <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${i.severity === "high" ? "bg-red-900/60 text-red-300" : i.severity === "medium" ? "bg-yellow-900/60 text-yellow-300" : "bg-blue-900/60 text-blue-300"}`}>{i.severity}</span></td>
                <td className="py-3 px-4 text-gray-400">{i.category}</td>
                <td className="py-3 px-4 text-gray-400">{i.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
