import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';

const SetupScreen = ({ onComplete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onComplete(name.trim());
    }
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-10 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#111111] border border-white/10 rounded-[2rem] p-10 text-center shadow-2xl"
      >
        <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="text-yellow-500 w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black mb-2 tracking-tighter text-white">Welcome to <span className="text-yellow-500 italic">Ascendia</span></h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.1em] text-xs mb-8">Let's get started. What should I call you?</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-yellow-500/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <div className="relative bg-black/50 border border-white/5 rounded-full p-2 flex items-center gap-4 focus-within:border-yellow-500/20 transition-all">
              <input
                type="text"
                placeholder="Enter your name..."
                className="flex-1 bg-transparent border-none outline-none text-white font-medium placeholder:text-white/20 px-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                disabled={!name.trim()}
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <ArrowRight className="text-black w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SetupScreen;
