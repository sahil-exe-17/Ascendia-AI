import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, GraduationCap, Briefcase, ChevronRight, BookOpen, Target, Star, Loader2 } from 'lucide-react';

const Roadmap = () => {
  const [branch, setBranch] = useState('Computer Science');
  const [role, setRole] = useState('Software Engineer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generate-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch, target_role: role }),
      });
      const data = await response.json();
      setRoadmap(data);
    } catch (error) {
      console.error("Failed to generate roadmap", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const branches = ["Computer Science", "IT", "Electronics", "Mechanical", "Civil"];
  const roles = ["Software Engineer", "Data Analyst", "Product Manager", "Hardware Engineer", "UI/UX Designer"];

  return (
    <div className="h-full overflow-y-auto p-12 max-w-6xl mx-auto no-scrollbar">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Career <span className="text-yellow-500 italic">Roadmap</span></h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Architect your professional timeline</p>
      </header>

      {!roadmap ? (
        <div className="flex items-center justify-center h-[50vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-white/20 ml-2 tracking-widest">Target Branch</label>
                <select 
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-yellow-500/20 appearance-none text-sm font-bold"
                >
                  {branches.map(b => <option key={b} value={b} className="bg-charcoal text-white">{b}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black text-white/20 ml-2 tracking-widest">Mastery Goal</label>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-yellow-500/20 appearance-none text-sm font-bold"
                >
                  {roles.map(r => <option key={r} value={r} className="bg-charcoal text-white">{r}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={generateRoadmap} 
              disabled={isGenerating}
              className="w-full bg-yellow-500 py-6 rounded-3xl text-black font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_50px_rgba(250,204,21,0.2)]"
            >
              {isGenerating ? <Loader2 className="animate-spin w-6 h-6" /> : <Target className="w-6 h-6" />}
              {isGenerating ? 'Mapping Intelligence...' : 'Generate Roadmap'}
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="space-y-12 pb-20">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmap.map((week, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111111] border border-white/5 p-6 rounded-[2rem] hover:border-yellow-500/20 transition-all"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-4 block">Week 0{week.week || idx+1}</span>
                <h4 className="text-sm font-black text-white/80 mb-4">{week.title}</h4>
                <p className="text-[10px] text-white/40 leading-relaxed font-medium line-clamp-3">{week.goal}</p>
                <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                   {week.topics.slice(0, 2).map((t, i) => (
                     <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-[8px] font-bold text-white/20 uppercase tracking-widest">{t}</span>
                   ))}
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => setRoadmap(null)} className="w-full py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition-all">Regenerate New Path</button>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
