import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ghost, 
  Send, 
  X, 
  Loader2, 
  CheckCheck, 
  Zap,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { cn } from '@/src/lib/utils';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "") {
    throw new Error("GEMINI_API_KEY is missing. Please set it in the Settings menu.");
  }
  return new GoogleGenAI({ apiKey });
};

interface Message {
  role: 'user' | 'agent' | 'system';
  text: string;
  time: string;
}

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'agent', 
      text: "Hi! I'm GHOST. I help businesses resurrect dead leads. Want to see how I work? Just start a conversation with me, then stop replying whenever you want to 'ghost' me!", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGhosted, setIsGhosted] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setIsGhosted(false);
    setChatError(null);

    try {
      const ai = getAI();
      const prompt = `You are GHOST, an AI sales agent for a premium SaaS product. 
      The user is a potential customer. 
      Your goal is to be helpful, professional, and slightly persuasive.
      
      Conversation history:
      ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}
      User: ${input}
      
      Respond as the Sales Agent. Keep it short and WhatsApp-style.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (!response.text) throw new Error("AI returned an empty response.");

      const agentMsg: Message = {
        role: 'agent',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (error: any) {
      console.error("Chat failed:", error);
      setChatError(error.message || "Chat failed. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  const simulateGhosting = async () => {
    if (isGhosted || messages.length < 2) return;
    
    setIsGhosted(true);
    setMessages(prev => [...prev, { 
      role: 'system', 
      text: "[User has stopped replying... GHOST is performing autopsy]", 
      time: "" 
    }]);

    // Wait for "autopsy"
    await new Promise(resolve => setTimeout(resolve, 2000));
    setChatError(null);

    try {
      const ai = getAI();
      const prompt = `You are the GHOST Resurrection Engine. 
      The user has just "ghosted" the sales agent after this conversation:
      
      ${messages.map(m => `${m.role}: ${m.text}`).join('\n')}
      
      Perform an autopsy: Why did they stop? (Price? Busy? Confused?)
      Then, craft a hyper-personalized resurrection message to win them back.
      
      Output ONLY the resurrection message.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      if (!response.text) throw new Error("AI returned an empty response.");

      const resurrectionMsg: Message = {
        role: 'agent',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, resurrectionMsg]);
    } catch (error: any) {
      console.error("Resurrection failed:", error);
      setChatError(error.message || "Resurrection failed.");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[380px] h-[550px] bg-[#0A0A0A] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Ghost className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">GHOST Playground</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/70 uppercase font-bold tracking-tighter">Active Hunter</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "max-w-[85%] p-3 rounded-2xl text-sm relative",
                    msg.role === 'user' 
                      ? "bg-white/10 text-white self-end rounded-tr-none ml-auto" 
                      : msg.role === 'agent'
                      ? "bg-purple-600/20 border border-purple-500/20 text-white self-start rounded-tl-none"
                      : "bg-white/5 border border-white/5 text-white/40 text-[10px] text-center w-full rounded-lg italic"
                  )}
                >
                  {msg.text}
                  {msg.time && (
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[9px] opacity-40">{msg.time}</span>
                      {msg.role === 'agent' && <CheckCheck className="w-3 h-3 text-blue-400 opacity-50" />}
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-white/40 text-xs italic">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  GHOST is typing...
                </div>
              )}
              {chatError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] flex items-center gap-2">
                  <Sparkles className="w-3 h-3" />
                  {chatError}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <div className="flex gap-2">
                <button 
                  onClick={simulateGhosting}
                  disabled={messages.length < 2 || isGhosted}
                  className="flex-1 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500/20 disabled:opacity-30 transition-all"
                >
                  Ghost the Agent
                </button>
                <button 
                  onClick={() => setMessages([messages[0]])}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:border-purple-500 outline-none transition-all"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-400 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all border-glow relative overflow-hidden group",
          isOpen ? "bg-rose-500" : "bg-purple-600"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <div className="relative">
            <Ghost className="w-8 h-8 text-white" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-purple-600"
            />
          </div>
        )}
      </motion.button>
    </div>
  );
}
