import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Zap, ShieldAlert, Loader2 } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze-resume`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult({
        score: data.ats_score || 0,
        keywords: data.keywords_found || [],
        suggestions: data.improvement_tips || [],
        improvedResume: data.improved_resume || ""
      });
    } catch (error) {
       console.error("Analysis Error:", error);
       alert("Analysis failed. Please ensure the backend is running on port 8001 and your GEMINI_API_KEY is set.");
       setResult(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyImprovedResume = () => {
    if (result?.improvedResume) {
      navigator.clipboard.writeText(result.improvedResume);
      alert("Improved resume copied to clipboard!");
    }
  };

  return (
    <div className="h-full flex flex-col p-10 overflow-y-auto no-scrollbar">
      <div className="max-w-4xl mx-auto w-full space-y-12">
        <header>
          <h2 className="text-4xl font-black tracking-tighter text-white mb-2">Resume <span className="text-yellow-500 italic">Scorecard</span></h2>
          <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs">AI-Powered ATS Optimization</p>
        </header>

        {!result ? (
          <div className="space-y-8">
            <div className="border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
               <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-6" onClick={() => document.getElementById('resume-upload').click()}>
                  <Upload className="text-yellow-500 w-8 h-8" />
               </div>
               <p className="text-lg font-bold text-white/60">Upload your Resume (PDF or DOCX)</p>
               <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files[0])} 
                id="resume-upload"
                accept="application/pdf, .doc, .docx"
               />
               <label htmlFor="resume-upload" className="mt-4 px-6 py-2 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all cursor-pointer">
                 {file ? file.name : 'Select File'}
               </label>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="w-full py-6 bg-yellow-500 rounded-[2rem] text-black font-black uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(250,204,21,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
               {analyzing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6 fill-current" />}
               {analyzing ? 'Processing Dataset...' : 'Generate Analysis & Improve'}
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8 pb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#111111] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                 <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-8">ATS Performance</p>
                 <div className="relative w-40 h-40 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-[10px] border-white/5" />
                    <div className="absolute inset-0 rounded-full border-[10px] border-yellow-500 border-t-transparent animate-pulse" />
                    <span className="text-6xl font-black italic">{result.score}</span>
                 </div>
                 <p className="mt-8 text-yellow-500 font-bold uppercase tracking-widest text-xs">Agent Approved</p>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                   <h4 className="flex items-center gap-2 text-sm font-black text-white/80 mb-6 uppercase tracking-widest">
                      <ShieldAlert className="w-4 h-4 text-yellow-500" />
                      Action Items
                   </h4>
                   <div className="space-y-4">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-3 text-xs text-white/50 leading-relaxed font-medium">
                           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1 shrink-0" />
                           {s}
                        </div>
                      ))}
                   </div>
                </div>
                <button 
                 onClick={() => setResult(null)}
                 className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all"
                >
                  Reset Analysis
                </button>
              </div>
            </div>

            {/* AI Improved Resume Section */}
            {result.improvedResume && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mt-4">
                 <div className="flex justify-between items-center mb-6">
                   <h4 className="flex items-center gap-2 text-sm font-black text-white/80 uppercase tracking-widest">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      AI Improved Resume Text
                   </h4>
                   <button 
                    onClick={copyImprovedResume}
                    className="px-4 py-2 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all"
                   >
                     Copy to Clipboard
                   </button>
                 </div>
                 <div className="bg-black/50 rounded-xl p-6 h-64 overflow-y-auto whitespace-pre-wrap text-xs text-white/70 font-mono leading-relaxed border border-white/5">
                    {result.improvedResume}
                 </div>
                 <p className="text-[10px] text-white/40 mt-4 italic">
                   Note: You can copy this enhanced content and update your local Word Document or PDF creator!
                 </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
