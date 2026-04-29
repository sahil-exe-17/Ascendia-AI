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
      
      if (!response.ok) throw new Error("HTTP Error");

      const data = await response.json();
      
      // Defensively parse in case AI wraps the array in an object
      let parsedData = data;
      if (!Array.isArray(data)) {
        parsedData = data.roadmap || data.data || data.weeks || Object.values(data)[0] || [];
      }
      
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
         throw new Error("Invalid format from AI");
      }

      setRoadmap(parsedData);
    } catch (error) {
      console.error("Failed to generate roadmap", error);
      alert("Failed to generate roadmap. Please try again or check your AI API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const branches = [
    "Computer Science", "Information Technology", "Artificial Intelligence & ML",
    "Data Science", "Cybersecurity", "Electronics & Communication",
    "Mechanical Engineering", "Civil Engineering", "Electrical Engineering",
    "Aerospace Engineering", "Biotechnology", "Finance & Accounting",
    "Marketing", "Human Resources", "Product Management", "UI/UX Design", "Game Development"
  ];
  const roles = [
    "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
    "Data Analyst", "Data Scientist", "Machine Learning Engineer", "Cloud Architect",
    "DevOps Engineer", "Cybersecurity Analyst", "Product Manager", "Hardware Engineer",
    "UI/UX Designer", "Marketing Executive", "HR Manager", "Financial Analyst",
    "Structural Engineer", "Automotive Engineer", "Game Programmer"
  ];

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
        <div className="space-y-12 pb-20 max-w-3xl mx-auto">
           <div className="relative border-l-2 border-white/10 ml-6 md:ml-10 space-y-12">
            {roadmap.map((week, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
                className="relative pl-10 md:pl-16"
              >
                {/* Timeline Dot with Glow */}
                <div className="absolute -left-[11px] top-6 w-5 h-5 rounded-full bg-yellow-500 border-[4px] border-black shadow-[0_0_20px_rgba(250,204,21,0.6)] z-10" />
                
                <div className="bg-[#111111] border border-white/5 p-8 rounded-[2rem] hover:border-yellow-500/30 transition-all duration-300 group relative overflow-hidden shadow-lg">
                  {/* Subtle hover background glow */}
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-duration-500 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-4 block">
                      Phase 0{week.week || idx+1}
                    </span>
                    <h4 className="text-xl md:text-2xl font-black text-white/90 mb-4">{week.title}</h4>
                    <p className="text-xs text-white/50 leading-relaxed font-medium mb-8 border-b border-white/5 pb-6">
                      {week.goal}
                    </p>
                    
                    <div>
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-3">Core Objectives</h5>
                      <div className="flex flex-wrap gap-2">
                         {week.topics.map((t, i) => (
                           <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:border-yellow-500/20 group-hover:text-yellow-500/80 transition-all">
                             {t}
                           </span>
                         ))}
                      </div>
                    </div>
                  </div>
                </div >
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: roadmap.length * 0.15 + 0.5 }}
            className="pt-8 pl-6 md:pl-10"
          >
            <button onClick={() => setRoadmap(null)} className="w-full py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:bg-white/10 hover:text-white transition-all shadow-lg">
              Regenerate New Path
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
