import React from 'react';
import { Search, Plus, Zap, User, ChevronRight, MessageSquare, FileText, Mic, Map } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, userName }) => {
  const modules = [
    { id: 'chat',      label: 'AI Chat',      icon: MessageSquare },
    { id: 'resume',    label: 'Resume Analyzer', icon: FileText },
    { id: 'interview', label: 'Mock Interview',  icon: Mic },
    { id: 'roadmap',   label: 'Career Roadmap',  icon: Map },
  ];

  return (
    <div className="flex flex-col h-full p-6 select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-black tracking-tighter text-sm uppercase text-white/80 self-center">Ascendia</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs outline-none focus:border-white/20"
        />
      </div>

      {/* Nav Modules */}
      <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4 mb-3">Modules</h4>
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => setActiveTab(mod.id)}
              className={`w-full flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 text-sm font-semibold ${
                activeTab === mod.id
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">{mod.label}</span>
              {activeTab === mod.id && <ChevronRight className="w-3 h-3" />}
            </button>
          );
        })}
      </div>

      {/* Profile Card */}
      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-yellow-500/70" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userName || 'User'}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Active Session</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
