import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, CheckCircle2, Award, ChevronRight, Zap, Loader2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const MockInterview = () => {
  const [phase, setPhase] = useState('setup');
  const [setup, setSetup] = useState({ domain: 'Software', difficulty: 'Medium' });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const questions = {
    Software: ["Diff between process and thread?", "Explain Inheritance.", "How to optimize slow DB query?"],
    Core: ["Reynolds number significance?", "Entropy in Thermodynamics?", "Crystal structures in materials?"],
    HR: ["Tell me about yourself.", "Why should we hire you?", "Handle conflict with team member?"]
  };

  const currentQuestions = questions[setup.domain];

  const handleNext = async () => {
    const newAnswers = [...answers, { question: currentQuestions[currentIdx], answer: currentAnswer }];
    setAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentIdx < currentQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsLoading(true);
      setPhase('feedback');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interview/evaluate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...setup, answers: newAnswers }),
        });
        const data = await response.json();
        setFeedback(data);
        confetti({ particleCount: 150, spread: 80, colors: ['#facc15', '#ffffff'] });
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-12 overflow-y-auto no-scrollbar">
      <header className="mb-12">
        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter">Mock <span className="text-yellow-500 italic">Interview</span></h2>
        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Real-time Agent evaluation simulation</p>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {phase === 'setup' && (
            <motion.div key="setup" className="w-full max-w-2xl bg-[#111111] border border-white/5 p-10 rounded-[2.5rem] space-y-10">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">Domain</label>
                     <div className="flex flex-col gap-2">
                        {['Software', 'Core', 'HR'].map(d => (
                          <button key={d} onClick={() => setSetup({...setup, domain: d})} className={`p-4 rounded-2xl text-xs font-bold transition-all ${setup.domain === d ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{d}</button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-white/20 tracking-widest">Intensity</label>
                     <div className="flex flex-col gap-2">
                        {['Easy', 'Medium', 'Hard'].map(d => (
                          <button key={d} onClick={() => setSetup({...setup, difficulty: d})} className={`p-4 rounded-2xl text-xs font-bold transition-all ${setup.difficulty === d ? 'bg-yellow-500 text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>{d}</button>
                        ))}
                     </div>
                  </div>
               </div>
               <button onClick={() => setPhase('interviewing')} className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                  <Play className="w-5 h-5 fill-current" /> Start Mission
               </button>
            </motion.div>
          )}

          {phase === 'interviewing' && (
             <motion.div key="inter" className="w-full max-w-3xl space-y-8">
                <div className="flex gap-2">
                   {currentQuestions.map((_, i) => (
                     <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentIdx ? 'bg-yellow-500' : 'bg-white/5'}`} />
                   ))}
                </div>
                <div className="bg-[#111111] border border-white/5 rounded-[2.5rem] p-10">
                   <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-6 italic">Query 0{currentIdx + 1}</p>
                   <h3 className="text-2xl font-black mb-10 leading-tight text-white/90">{currentQuestions[currentIdx]}</h3>
                   <textarea value={currentAnswer} onChange={e => setCurrentAnswer(e.target.value)} placeholder="Type your response dataset..." className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm font-medium outline-none focus:border-yellow-500/20" />
                   <div className="flex justify-end mt-8">
                      <button onClick={handleNext} disabled={!currentAnswer.trim()} className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 disabled:opacity-50">
                         {currentIdx === currentQuestions.length - 1 ? 'Analyze Performance' : 'Commit Logic'} <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </motion.div>
          )}

          {phase === 'feedback' && (
             <motion.div key="feedback" className="w-full max-w-4xl">
               {isLoading ? (
                  <div className="flex flex-col items-center gap-6">
                     <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
                     <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/20">Agent Analyzing Results...</p>
                  </div>
               ) : (
                  <div className="space-y-8">
                     <div className="grid grid-cols-3 gap-6">
                        <div className="bg-[#111111] border border-white/5 p-8 rounded-[2rem] text-center">
                           <Award className="w-8 h-8 mx-auto text-yellow-500 mb-4" />
                           <h4 className="text-4xl font-black italic">{feedback?.overall_score || 0}/10</h4>
                        </div>
                        <div className="col-span-2 bg-[#111111] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-center">
                           <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">Core Accuracy</p>
                           <div className="h-3 bg-white/5 rounded-full relative">
                              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(feedback?.technical_accuracy || 0) * 10}%` }} />
                           </div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-6 pb-20">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-green-500 mb-6">Strengths</h5>
                           <div className="space-y-4">
                              {feedback?.strengths.map((s, i) => (
                                <div key={i} className="flex gap-3 text-xs text-white/60 leading-relaxed"><CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> {s}</div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem]">
                           <h5 className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-6">Improvements</h5>
                           <div className="space-y-4">
                              {feedback?.suggestions.map((s, i) => (
                                <div key={i} className="flex gap-3 text-xs text-white/60 leading-relaxed"><Zap className="w-4 h-4 text-yellow-500 shrink-0" /> {s}</div>
                              ))}
                           </div>
                        </div>
                        <button onClick={() => {setPhase('setup'); setAnswers([]);}} className="col-span-2 py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center justify-center gap-3 hover:text-white transition-all"><RotateCcw className="w-4 h-4" /> Re-initialize Mission</button>
                     </div>
                  </div>
               )}
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MockInterview;
