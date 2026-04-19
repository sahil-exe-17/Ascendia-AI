import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import MockInterview from './components/MockInterview';
import Roadmap from './components/Roadmap';

function App() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'chat': return <ChatInterface setActiveTab={setActiveTab} />;
      case 'resume': return <ResumeAnalyzer />;
      case 'interview': return <MockInterview />;
      case 'roadmap': return <Roadmap />;
      default: return <ChatInterface setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="w-full h-screen bg-[#050505] relative flex items-center justify-center overflow-hidden">
      {/* Background Decorative Text Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <h1 className="bg-text opacity-5 absolute -top-10 -left-10 transform -rotate-2">AI Agent</h1>
        <h1 className="bg-text opacity-5 absolute -bottom-10 -right-10 transform rotate-2">Ascendia</h1>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ai-container"
          >
            {/* Sidebar */}
            <div className="w-[300px] border-r border-white/5 bg-[#0e0e0e] flex flex-col h-full shrink-0">
               <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-black/40 h-full relative overflow-hidden">
               {/* Ambient Glows */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/[0.03] blur-[120px] rounded-full -mr-40 -mt-40 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/[0.02] blur-[120px] rounded-full -ml-40 -mb-40 pointer-events-none" />
               
               <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
