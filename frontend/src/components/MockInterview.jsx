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
    'Software Engineering': ["Difference between process and thread?", "Explain Inheritance and Polymorphism.", "How to optimize a slow database query?"],
    'Frontend Dev': ["What is the Virtual DOM?", "Explain the CSS box model.", "How do you optimize React performance?"],
    'Backend Dev': ["REST vs GraphQL?", "What are database ACID properties?", "Explain JWT authentication."],
    'Full Stack Dev': ["Explain the MVC architecture.", "How do you manage state in a complex application?", "What are WebSockets?"],
    'Mobile App Dev': ["Explain the app lifecycle.", "What is the difference between native and cross-platform?", "How do you handle background tasks?"],
    'Data Science': ["What is overfitting and how do you prevent it?", "Explain the Bias-Variance tradeoff.", "How does a Random Forest work?"],
    'Data Analytics': ["What is the difference between WHERE and HAVING in SQL?", "Explain A/B testing.", "How do you handle missing values in a dataset?"],
    'Machine Learning / AI': ["Explain gradient descent.", "Supervised vs Unsupervised learning?", "How do you evaluate a classification model?"],
    'Cybersecurity': ["What is SQL Injection?", "Explain RSA encryption.", "Difference between Symmetric and Asymmetric encryption?"],
    'Cloud Computing': ["What is the difference between IaaS, PaaS, and SaaS?", "Explain horizontal vs vertical scaling.", "What are microservices?"],
    'DevOps': ["What is CI/CD?", "Explain containerization vs virtualization.", "How do you handle infrastructure as code?"],
    'QA / Testing': ["Difference between unit and integration testing?", "Explain Regression Testing.", "How do you write a good test case?"],
    'Blockchain / Web3': ["What is a smart contract?", "Proof of Work vs Proof of Stake?", "What is a 51% attack?"],
    'IoT (Internet of Things)': ["What are common IoT protocols (MQTT, CoAP)?", "Explain IoT edge computing.", "How do you handle IoT device security?"],
    'Product Management': ["How do you prioritize features?", "What is a Minimum Viable Product (MVP)?", "How do you handle conflicting stakeholder requests?"],
    'Project Management': ["Agile vs Waterfall methodology?", "How do you handle scope creep?", "What is a Gantt chart?"],
    'Business Analyst': ["What is a Business Requirement Document (BRD)?", "Explain SWOT analysis.", "How do you handle a difficult stakeholder?"],
    'UI/UX Design': ["What is the difference between UI and UX?", "Explain your design thinking process.", "How do you conduct user research?"],
    'Human Resources': ["Tell me about yourself.", "Why should we hire you?", "Describe a time you handled a conflict with a team member."],
    'Marketing': ["What is SEO and why is it important?", "How do you measure a successful campaign?", "Explain inbound vs outbound marketing."],
    'Sales & Business Dev': ["Pitch me a pen.", "How do you handle objections from a client?", "Difference between B2B and B2C sales?"],
    'Finance & Accounting': ["Walk me through the three financial statements.", "What is working capital?", "Explain DCF (Discounted Cash Flow)."],
    'Supply Chain & Operations': ["What is the bullwhip effect?", "Explain Just-In-Time (JIT) manufacturing.", "How do you optimize inventory management?"],
    'Consulting': ["Walk me through a market sizing guesstimate.", "How do you approach a profitability decline case?", "What is the MECE principle?"],
    'Mechanical Eng': ["What is the First Law of Thermodynamics?", "Explain the stress-strain curve.", "Difference between hydraulic and pneumatic systems?"],
    'Electrical Eng': ["Explain Ohm's Law.", "What is the difference between AC and DC?", "How does a transformer work?"],
    'Civil Eng': ["Difference between a beam and a column?", "Explain the purpose of reinforcement in concrete.", "What are the different types of foundations?"],
    'Electronics & Comm (ECE)': ["What is a multiplexer?", "Explain modulation and demodulation.", "Difference between microprocessors and microcontrollers?"],
    'Chemical Eng': ["Explain distillation.", "What is the Reynolds number?", "Difference between an endothermic and exothermic reaction?"],
    'Aerospace Eng': ["Explain Bernoulli's principle.", "What are the four forces of flight?", "Difference between a jet engine and a rocket engine?"],
    'Automobile Eng': ["Explain the 4-stroke engine cycle.", "What is the function of a differential?", "Difference between a supercharger and a turbocharger?"],
    'Robotics & Mechatronics': ["What are degrees of freedom in a robot?", "Explain PID controllers.", "Forward vs inverse kinematics?"],
    'Biotechnology': ["What is PCR (Polymerase Chain Reaction)?", "Explain CRISPR technology.", "What are monoclonal antibodies?"],
    'Metallurgy & Materials': ["Explain the iron-carbon phase diagram.", "Difference between annealing and tempering?", "What are alloys?"],
    'Game Dev': ["What is a game loop?", "Explain Delta Time.", "How does collision detection work?"]
  };

  const domains = Object.keys(questions);
  const currentQuestions = questions[setup.domain] || questions['Software Engineering'];

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
        alert("Interview evaluation failed. Please ensure the backend is running on port 8001.");
        setPhase('setup');
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
                     <select 
                       value={setup.domain}
                       onChange={(e) => setSetup({...setup, domain: e.target.value})}
                       className="w-full bg-black border border-white/5 rounded-2xl p-4 outline-none focus:border-yellow-500/20 appearance-none text-sm font-bold text-white"
                     >
                        {domains.map(d => (
                          <option key={d} value={d} className="bg-black text-white">{d}</option>
                        ))}
                     </select>
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
