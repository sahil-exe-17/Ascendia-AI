import React from 'react';
import { Search, Plus, Zap, User, ChevronRight, MoreHorizontal } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const groups = [
    { label: 'Today', items: ['Career Roadmap Generator', 'Resume Analysis'] },
    { label: 'Yesterday', items: ['Mock Interview Practice'] },
  ];

  const modules = [
    { id: 'chat', label: 'AI Chat' },
    { id: 'resume', label: 'Analyzer' },
    { id: 'interview', label: 'Interview' },
    { id: 'roadmap', label: 'Roadmap' },
  ];

  return (
    <div className="flex flex-col h-full p-6 select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between mb-10">
         <div className="flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 hover:bg-yellow-500/20 transition-all">
               <Plus className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 transition-all">
               <Zap className="w-4 h-4" />
            </button>
         </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
         <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
         <input 
          type="text" 
          placeholder="Search activity..." 
          className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs outline-none focus:border-white/20"
         />
      </div>

      {/* History Sections */}
      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
         {groups.map((group) => (
           <div key={group.label} className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4 mb-3">{group.label}</h4>
              <div className="space-y-1">
                 {group.items.map((item, i) => (
                   <div key={i} className="sidebar-pill group">
                      <span className="truncate">{item}</span>
                      <MoreHorizontal className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                   </div>
                 ))}
              </div>
           </div>
         ))}

         {/* Nav Switcher */}
         <div className="space-y-2 pt-6 border-t border-white/5">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-4 mb-3">Modules</h4>
            <div className="space-y-1">
               {modules.map((mod) => (
                 <button 
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`sidebar-pill w-full ${activeTab === mod.id ? 'active' : ''}`}
                 >
                    {mod.label}
                    <ChevronRight className={`w-3 h-3 ${activeTab === mod.id ? 'block' : 'hidden'}`} />
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Purchase Card */}
      <div className="mt-8 mb-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500/10 group cursor-pointer hover:border-yellow-500/30 transition-all">
           <h5 className="text-[10px] font-black uppercase text-yellow-500 mb-1">Upgrade to Pro</h5>
           <p className="text-[9px] text-white/40 leading-tight">Get unlimited AI feedback and advanced mock interviews.</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="pt-6 border-t border-white/5">
         <div className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/10 flex items-center justify-center">
               <User className="w-4 h-4 text-yellow-500/50" />
            </div>
            <div className="flex-1">
               <p className="text-xs font-bold">Sahil Lale</p>
               <p className="text-[9px] font-black uppercase tracking-widest text-white/20">Pro Member</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Sidebar;
