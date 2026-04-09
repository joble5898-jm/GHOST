import { motion, AnimatePresence } from 'motion/react';
import { 
  Ghost, 
  Zap, 
  Search, 
  MessageSquare, 
  CheckCheck, 
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import ChatPreview from './ChatPreview';
import { cn } from '@/src/lib/utils';

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined. Please set it in your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

interface Lead {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  status: 'idle' | 'scanning' | 'autopsy' | 'resurrected';
  history: { role: 'user' | 'agent'; text: string; time: string }[];
  autopsy?: any;
}

const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    lastMessage: 'How much is it?',
    time: '2 days ago',
    status: 'idle',
    history: [
      { role: 'user', text: "Hey! I saw your ad for the premium plan. How much is it?", time: "2 days ago" },
      { role: 'agent', text: "It's $499/mo for the full suite!", time: "2 days ago" },
    ]
  },
  {
    id: '2',
    name: 'Marcus Chen',
    lastMessage: 'I need to check with my team.',
    time: '5 days ago',
    status: 'idle',
    history: [
      { role: 'user', text: "This looks great. Does it support multi-user access?", time: "5 days ago" },
      { role: 'agent', text: "Yes, up to 50 users on the enterprise plan.", time: "5 days ago" },
      { role: 'user', text: "Got it. I need to check with my team and get back to you.", time: "5 days ago" },
    ]
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    lastMessage: 'Can we do a demo tomorrow?',
    time: '1 week ago',
    status: 'idle',
    history: [
      { role: 'user', text: "I'm interested in the automation features.", time: "1 week ago" },
      { role: 'agent', text: "I'd love to show you! Are you free for a demo tomorrow at 10 AM?", time: "1 week ago" },
      { role: 'user', text: "Can we do a demo tomorrow?", time: "1 week ago" },
      { role: 'agent', text: "Yes! 10 AM or 2 PM works for me. Which is better?", time: "1 week ago" },
    ]
  }
];

export default function DemoDashboard({ onBack }: { onBack: () => void }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [isHunting, setIsHunting] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);

  const runAutopsy = async (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'autopsy' } : l));
    setActiveLeadId(leadId);

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      const ai = getAI();
      const prompt = `Analyze this WhatsApp conversation history and perform an "autopsy" to understand why the lead went silent.
      
      Conversation:
      ${lead.history.map(m => `${m.role}: ${m.text}`).join('\n')}
      
      Output a JSON object with:
      - ghost_reason: (e.g., Price Shock, Distraction, Internal Blocker, etc.)
      - confidence: (0-1)
      - customer_intent: (e.g., High, Medium, Low)
      - recommended_strategy: (e.g., Value Reframe, Empathy, Humor)
      - tone: (e.g., Warm, Professional, Direct)
      - resurrection_message: (A personalized WhatsApp message to send now)
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              ghost_reason: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              customer_intent: { type: Type.STRING },
              recommended_strategy: { type: Type.STRING },
              tone: { type: Type.STRING },
              resurrection_message: { type: Type.STRING },
            },
            required: ["ghost_reason", "confidence", "customer_intent", "recommended_strategy", "tone", "resurrection_message"]
          }
        }
      });

      const result = JSON.parse(response.text);
      
      setLeads(prev => prev.map(l => l.id === leadId ? { 
        ...l, 
        status: 'resurrected', 
        autopsy: {
          reason: result.ghost_reason,
          strategy: result.recommended_strategy,
          confidence: result.confidence,
          message: result.resurrection_message
        } 
      } : l));
    } catch (error) {
      console.error("Autopsy failed:", error);
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'idle' } : l));
    }
  };

  const toggleHunting = () => {
    setIsHunting(!isHunting);
  };

  const [customConvo, setCustomConvo] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const addCustomLead = () => {
    if (!customConvo.trim()) return;
    
    const lines = customConvo.split('\n').filter(l => l.trim());
    const history = lines.map(l => {
      const isAgent = l.toLowerCase().startsWith('agent:') || l.toLowerCase().startsWith('me:');
      const text = l.replace(/^(agent:|me:|user:|customer:)\s*/i, '');
      return {
        role: (isAgent ? 'agent' : 'user') as 'agent' | 'user',
        text,
        time: "Just now"
      };
    });

    const newLead: Lead = {
      id: Date.now().toString(),
      name: "Custom Lead",
      lastMessage: history[history.length - 1]?.text || "New Conversation",
      time: "Just now",
      status: 'idle',
      history
    };

    setLeads([newLead, ...leads]);
    setCustomConvo("");
    setIsAdding(false);
    setActiveLeadId(newLead.id);
  };

  return (
    <div className="min-h-screen bg-[#050505] p-6 relative">
      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Ghost className="w-6 h-6 text-purple-500" />
                GHOST Live Dashboard
              </h1>
              <p className="text-sm text-white/40">Monitoring Happilee WhatsApp Stream</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsAdding(true)}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
            >
              + Add Custom Chat
            </button>
            <button 
              onClick={toggleHunting}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all",
                isHunting 
                  ? "bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20" 
                  : "bg-emerald-500 border-glow text-black hover:bg-emerald-400"
              )}
            >
              {isHunting ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  Stop Hunting
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Start Hunting
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Custom Chat Modal */}
        <AnimatePresence>
          {isAdding && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#0A0A0A] border border-white/10 p-8 rounded-[2rem] max-w-2xl w-full space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Resurrect Custom Chat</h3>
                  <p className="text-sm text-white/40">Paste a dead conversation history below. Use "User:" and "Agent:" prefixes.</p>
                </div>
                <textarea 
                  value={customConvo}
                  onChange={(e) => setCustomConvo(e.target.value)}
                  placeholder="User: Hey, how much is the plan?&#10;Agent: It's $50/mo!&#10;User: Oh, let me think about it."
                  className="w-full h-48 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-purple-500 outline-none transition-all resize-none"
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={addCustomLead}
                    className="flex-1 py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 font-bold transition-all border-glow"
                  >
                    Import to GHOST
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Dead Conversations</h2>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{leads.length} Found</span>
            </div>

            <div className="space-y-3">
              {leads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  onClick={() => setActiveLeadId(lead.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer group",
                    activeLeadId === lead.id 
                      ? "bg-purple-500/10 border-purple-500/40" 
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center border border-white/10">
                        <span className="text-xs font-bold">{lead.name[0]}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{lead.name}</h4>
                        <p className="text-[10px] text-white/40">{lead.time}</p>
                      </div>
                    </div>
                    {lead.status === 'resurrected' && (
                      <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase">
                        Resurrected
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/60 line-clamp-1 mb-4 italic">"{lead.lastMessage}"</p>
                  
                  {lead.status === 'idle' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        runAutopsy(lead.id);
                      }}
                      disabled={!isHunting}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Run Autopsy
                    </button>
                  )}

                  {lead.status === 'autopsy' && (
                    <div className="w-full py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center gap-2">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Analyzing...</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Active Inspection */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeLeadId ? (
                <motion.div
                  key={activeLeadId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Conversation Inspection</h2>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">Live Stream</span>
                    </div>
                  </div>

                  <ChatPreview 
                    title={leads.find(l => l.id === activeLeadId)?.name || ""}
                    messages={leads.find(l => l.id === activeLeadId)?.history.map(m => ({
                      role: m.role,
                      text: m.text,
                      time: m.time
                    })) || []}
                    autopsy={leads.find(l => l.id === activeLeadId)?.autopsy}
                  />

                  {leads.find(l => l.id === activeLeadId)?.status === 'resurrected' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCheck className="w-5 h-5" />
                          <h3 className="font-bold">Resurrection Successful</h3>
                        </div>
                        <span className="text-[10px] text-white/20 font-mono">ID: {activeLeadId}</span>
                      </div>
                      <p className="text-sm text-white/60">
                        The agent successfully matched the customer's tone and addressed the 
                        <span className="text-white font-bold mx-1">"{leads.find(l => l.id === activeLeadId)?.autopsy.reason}"</span> 
                        blocker. Message fired through Happilee API.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white/20" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/40">No Lead Selected</h3>
                    <p className="text-sm text-white/20">Select a conversation from the left to begin inspection.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
    </div>
  );
}
