import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
const API = 'http://localhost:8000';
const card = { background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, marginBottom: 16 };
const btn = { padding: '10px 20px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'transform .15s' };
const input = { width: '100%', padding: 10, marginBottom: 10, background: '#0d1117', color: '#c9d1d9', border: '1px solid #30363d', borderRadius: 8, fontSize: 14 };

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const send = async () => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: text }]);
    setText("");
    setLoading(true);
    try {
      const r = await fetch(`${API}/api/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: text }) });
      const d = await r.json();
      setMessages(prev => [...prev, { role: "assistant", content: d?.answer || "No response." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + e.message }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">💬 Chat with FixTrace</h2>
      <div style={{ ...card, height: 420, overflowY: "auto", marginBottom: 12 }}>
        {messages.length === 0 && <p className="text-gray-500">Ask about your incident history...</p>}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block max-w-[80%] p-3 rounded-lg whitespace-pre-wrap ${m.role === "user" ? "bg-indigo-600" : "bg-white/5"}`}>{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-gray-400">Thinking...</div>}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} style={{ ...input, marginBottom: 0 }} placeholder="Ask FixTrace..." />
        <button onClick={send} disabled={loading} style={{ ...btn, opacity: loading ? 0.6 : 1 }}>Send</button>
      </div>
    </div>
  );
}
