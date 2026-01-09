
import React, { useState, useEffect, useCallback } from 'react';
import { DisasterRecord, DisasterType, Severity, User } from './types';
import { INITIAL_RECORDS, DISASTER_ICONS, SEVERITY_COLORS } from './constants';
import GlassCard from './components/GlassCard';
import DisasterMap from './components/DisasterMap';
import DisasterForm from './components/DisasterForm';
import { getSafetyTips } from './services/geminiService';

const App: React.FC = () => {
  const [records, setRecords] = useState<DisasterRecord[]>(INITIAL_RECORDS);
  const [user, setUser] = useState<User | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<DisasterRecord | null>(null);
  const [safetyTips, setSafetyTips] = useState<string>('');
  const [loadingTips, setLoadingTips] = useState(false);
  const [view, setView] = useState<'map' | 'report'>('map');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Fetch User Location on Mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback location if denied (e.g., London)
          setUserLocation([51.5074, -0.1278]);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'password') {
      setUser({ username: 'Admin', isAdmin: true });
      setShowAdminLogin(false);
      setAdminUsername('');
      setAdminPassword('');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('map');
  };

  // Add new record
  const handleAddRecord = (recordData: Omit<DisasterRecord, 'id' | 'reportedBy'>) => {
    const newRecord: DisasterRecord = {
      ...recordData,
      id: Math.random().toString(36).substr(2, 9),
      reportedBy: user?.username || 'System',
    };
    setRecords(prev => [newRecord, ...prev]);
    setView('map');
  };

  // Select record & get AI tips
  const handleSelectRecord = async (record: DisasterRecord) => {
    setSelectedRecord(record);
    setLoadingTips(true);
    setSafetyTips('');
    const tips = await getSafetyTips(record.type, record.severity, record.location);
    setSafetyTips(tips);
    setLoadingTips(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <nav className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
            <i className="fa-solid fa-satellite-dish text-2xl text-white"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">DisasterWatch</h1>
            <p className="text-sm opacity-50 font-medium">Global Real-time Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!user ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="liquid-glass px-6 py-2 rounded-xl text-sm font-semibold liquid-glass-hover"
            >
              Admin Login
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium opacity-70">Logged in as {user.username}</span>
              <button
                onClick={() => setView(view === 'map' ? 'report' : 'map')}
                className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95"
              >
                {view === 'map' ? 'New Report' : 'Back to Map'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-semibold border border-white/10 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {view === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Stats & List */}
            <div className="space-y-6">
              <GlassCard className="from-blue-600/20 to-transparent bg-gradient-to-br">
                <h3 className="text-lg font-semibold mb-4 opacity-80">Global Alert Level</h3>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-red-500">8.2</span>
                  <span className="text-sm font-medium opacity-50 pb-2">High Activity</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-4">
                   <div className="bg-red-500 h-full rounded-full w-[82%]"></div>
                </div>
              </GlassCard>

              <GlassCard className="h-[600px] flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Active Reports</h3>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {records.map(record => (
                    <div
                      key={record.id}
                      onClick={() => handleSelectRecord(record)}
                      className={`
                        p-4 rounded-xl border border-white/10 transition-all cursor-pointer hover:bg-white/10
                        ${selectedRecord?.id === record.id ? 'bg-white/15 border-blue-500/50 ring-1 ring-blue-500/50' : 'bg-white/5'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`${SEVERITY_COLORS[record.severity]} text-lg`}>
                            {DISASTER_ICONS[record.type]}
                          </span>
                          <span className="font-bold">{record.type}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${record.severity === Severity.CRITICAL ? 'border-red-500 text-red-500 bg-red-500/10' : 'border-white/20 opacity-50'}`}>
                          {record.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{record.location}</p>
                      <p className="text-[10px] opacity-40 mt-1">{new Date(record.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Middle & Right: Map & Detail */}
            <div className="lg:col-span-2 space-y-8">
              <DisasterMap 
                records={records} 
                onSelectRecord={handleSelectRecord} 
                userLocation={userLocation}
              />

              {selectedRecord && (
                <GlassCard className="relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl pointer-events-none transition-transform group-hover:scale-110 duration-700">
                    {DISASTER_ICONS[selectedRecord.type]}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-2xl ${SEVERITY_COLORS[selectedRecord.severity]}`}>
                          {DISASTER_ICONS[selectedRecord.type]}
                        </span>
                        <h2 className="text-2xl font-bold">{selectedRecord.location}</h2>
                      </div>
                      <div className="flex items-center gap-4 text-sm opacity-60 mb-4">
                        <span><i className="fa-regular fa-calendar mr-1"></i> {selectedRecord.date}</span>
                        <span><i className="fa-solid fa-user-shield mr-1"></i> Reported by {selectedRecord.reportedBy}</span>
                      </div>
                      <p className="text-lg opacity-90 leading-relaxed mb-6">
                        {selectedRecord.description}
                      </p>
                      
                      <div className="flex gap-4">
                        <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all border border-white/10">
                           <i className="fa-solid fa-share-nodes mr-2"></i> Share Alert
                        </button>
                        <button className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 py-3 rounded-xl font-bold transition-all border border-blue-500/20">
                           <i className="fa-solid fa-location-dot mr-2"></i> View Terrain
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-400">
                        <i className="fa-solid fa-robot"></i>
                        AI Safety Advisor
                      </h4>
                      {loadingTips ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4">
                          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-xs opacity-50 animate-pulse">Generating survival strategies...</p>
                        </div>
                      ) : (
                        <div className="text-sm prose prose-invert opacity-90 prose-p:mb-2 whitespace-pre-line">
                          {safetyTips}
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        ) : (
          <DisasterForm onSubmit={handleAddRecord} />
        )}
      </main>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <GlassCard className="w-full max-w-md relative overflow-hidden">
            <button 
              onClick={() => setShowAdminLogin(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
            <h2 className="text-2xl font-bold mb-6">Administrator Access</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm opacity-50 mb-1">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="admin"
                />
              </div>
              <div>
                <label className="block text-sm opacity-50 mb-1">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="password"
                />
              </div>
              <p className="text-[10px] opacity-40 italic">Demo hint: username: admin, password: password</p>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 mt-4"
              >
                Sign In
              </button>
            </form>
          </GlassCard>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40 text-sm">
        <p>&copy; 2024 DisasterWatch AI. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-400 transition-colors">Emergency Protocol</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Data Privacy</a>
          <a href="#" className="hover:text-blue-400 transition-colors">API Docs</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
