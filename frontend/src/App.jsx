import { useState } from 'react';
import Dashboard from './Dashboard';
import NewIncident from './NewIncident';
import Analytics from './Analytics';
import Chat from './Chat';
import Sidebar from './Sidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 w-full h-full p-8 overflow-y-auto border-l border-white/10 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black -z-10" />
        {activeTab === 'Dashboard' && <Dashboard />}
        {activeTab === 'NewIncident' && <NewIncident />}
        {activeTab === 'Analytics' && <Analytics />}
        {activeTab === 'Chat' && <Chat />}
      </main>
    </div>
  );
}
