export default function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'Dashboard', label: 'Dashboard' },
    { id: 'NewIncident', label: 'New Incident' },
    { id: 'Analytics', label: 'Analytics' },
    { id: 'Chat', label: 'AI Chat' }
  ];

  return (
    <aside className="w-64 h-full bg-white/5 backdrop-blur-md flex flex-col p-6 border-r border-white/10">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">FixTrace</h1>
        <p className="text-xs text-gray-400 mt-1">Hindsight Memory Active</p>
      </div>
      
      <nav className="flex flex-col gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 rounded-lg text-left transition-all font-medium ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
