import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-6xl font-black italic tracking-tighter"
      >
        ASCENDIA AI
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-sm font-bold tracking-[0.4em] uppercase"
      >
        Initializing...
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
