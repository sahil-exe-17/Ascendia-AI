import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calculator, Package, Send, Zap, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatInterface = ({ setActiveTab, userName }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const cards = [
    { label: 'Search advice', sub: 'Placement help', icon: Search, tab: 'chat' },
    { label: 'Analyze Resume', sub: 'ATS scoring', icon: Package, tab: 'resume' },
    { label: 'Map Career', sub: 'Roadmap gen', icon: Calculator, tab: 'roadmap' }
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          user_name: userName || 'User',
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Service unavailable');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || "No data received." }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error.message}. Please check if the backend is running on port 8001.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-10 relative overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8 relative z-20">
         <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded flex items-center justify-center">
               <Zap className="text-black w-4 h-4" />
            </div>
            <span className="font-black tracking-tighter text-sm uppercase text-white/80">Ascendia AI</span>
         </div>
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">v1.2 Agent Alpha</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
               <User className="w-4 h-4" />
            </div>
         </div>
      </div>

      {/* Main Area: Welcome or Chat History */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 mb-6 px-4" ref={scrollRef}>
        <AnimatePresence mode="wait">
          {messages.length === 0 ? (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center -mt-10"
            >
              <div className="orb mb-12">
                 <div className="orb-core" />
              </div>
              <div className="text-center">
                <h2 className="text-5xl font-black mb-4 tracking-tighter">
                  Welcome back <span className="text-yellow-500 italic">{userName || 'User'}!</span>
                </h2>
                <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-xs">I'm ready to help you with your placement goals.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 max-w-4xl mx-auto pt-4"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] rounded-3xl px-6 py-4 text-sm font-medium leading-relaxed ${
                     msg.role === 'user' 
                     ? 'bg-yellow-500 text-black shadow-[0_10px_30px_rgba(250,204,21,0.2)]' 
                     : 'bg-white/5 border border-white/10 text-white/80 backdrop-blur-md'
                   }`}>
                      {msg.role === 'assistant' ? (
                        <div className="markdown-body">
                          <ReactMarkdown
                            components={{
                              h3: ({children}) => <h3 className="text-yellow-400 font-black text-base mt-4 mb-2 tracking-tight">{children}</h3>,
                              h2: ({children}) => <h2 className="text-yellow-400 font-black text-lg mt-4 mb-2 tracking-tight">{children}</h2>,
                              h1: ({children}) => <h1 className="text-yellow-400 font-black text-xl mt-4 mb-2 tracking-tight">{children}</h1>,
                              strong: ({children}) => <strong className="text-yellow-300 font-bold">{children}</strong>,
                              em: ({children}) => <em className="text-white/90 italic">{children}</em>,
                              p: ({children}) => <p className="mb-2 leading-relaxed text-white/75">{children}</p>,
                              ul: ({children}) => <ul className="list-disc list-inside space-y-1.5 mb-3 text-white/70">{children}</ul>,
                              ol: ({children}) => <ol className="list-decimal list-inside space-y-1.5 mb-3 text-white/70">{children}</ol>,
                              li: ({children}) => <li className="leading-relaxed">{children}</li>,
                              code: ({inline, className, children}) => {
                                if (inline) {
                                  return <code className="bg-white/10 text-yellow-300 px-1.5 py-0.5 rounded-md text-xs font-mono">{children}</code>;
                                }
                                return (
                                  <div className="my-3 rounded-2xl overflow-hidden border border-white/10">
                                    <div className="bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30 border-b border-white/5">Code</div>
                                    <pre className="bg-black/40 p-4 overflow-x-auto">
                                      <code className="text-green-400 text-xs font-mono leading-relaxed">{children}</code>
                                    </pre>
                                  </div>
                                );
                              },
                              blockquote: ({children}) => <blockquote className="border-l-2 border-yellow-500/50 pl-4 my-2 text-white/50 italic">{children}</blockquote>,
                              hr: () => <hr className="border-white/10 my-4" />,
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                   </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-white/5 border border-white/10 rounded-3xl px-6 py-4 flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
                      <span className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">Agent Thinking...</span>
                   </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input & Quick Cards */}
      <div className="mt-auto w-full max-w-4xl mx-auto space-y-6 relative z-20">
        <div className="relative group">
           <div className="absolute -inset-1 bg-yellow-500/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
           <div className="relative bg-[#111111] border border-white/5 rounded-full p-2 flex items-center gap-4 focus-within:border-yellow-500/20 transition-all shadow-2xl">
              <div className="w-10 h-10 flex items-center justify-center text-white/20 ml-2">
                 <Zap className="w-5 h-5" />
              </div>
              <input 
               type="text" 
               placeholder="Ask anything about placements..." 
               className="flex-1 bg-transparent border-none outline-none text-white font-medium placeholder:text-white/20"
               value={input}
               onKeyPress={(e) => e.key === 'Enter' && handleSend()}
               onChange={(e) => setInput(e.target.value)}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(250,204,21,0.4)] disabled:opacity-50"
              >
                 <Send className="text-black w-4 h-4 fill-current" />
              </button>
           </div>
        </div>

        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">
             {cards.map((card, i) => (
               <button
                 key={i}
                 onClick={() => setActiveTab(card.tab)}
                 className="action-card group"
               >
                <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/10 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all">
                   <card.icon className="w-5 h-5" />
                </div>
                <div>
                   <h5 className="text-sm font-black text-white/90">{card.label}</h5>
                   <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest mt-1">{card.sub}</p>
                </div>
               </button>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
