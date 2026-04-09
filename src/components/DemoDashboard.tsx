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
  Loader2,
  Activity,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
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

interface ActivityLog {
  id: string;
  type: 'system' | 'api' | 'ai' | 'success' | 'warning';
  message: string;
  time: string;
  meta?: string;
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
  const [logs, setLogs] = useState<ActivityLog[]>([
    { id: '1', type: 'system', message: 'GHOST System Initialized', time: '10:00 AM', meta: 'v1.0.4' },
    { id: '2', type: 'api', message: 'Connected to Happilee WhatsApp API', time: '10:01 AM', meta: '200 OK' }
  ]);
  const [stats, setStats] = useState({
    scanned: 1242,
    resurrected: 84,
    conversion: 12.4
  });

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulated Hunting Activity
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHunting) {
      interval = setInterval(() => {
        const events: { type: ActivityLog['type']; msg: string; meta?: string }[] = [
          { type: 'api', msg: 'GET /v1/messages/stream', meta: '200 OK' },
          { type: 'system', msg: 'Scanning thread pool...', meta: '124 active' },
          { type: 'ai', msg: 'Analyzing sentiment for Thread #8292', meta: 'Gemini-3-Flash' },
          { type: 'api', msg: 'Happilee Webhook Heartbeat', meta: 'latency: 42ms' },
          { type: 'system', msg: 'Idle threshold reached for Lead "Marcus"', meta: '72h silent' },
          { type: 'ai', msg: 'Drafting resurrection strategy...', meta: 'Strategy: Value-First' },
          { type: 'success', msg: 'Message queued for delivery', meta: 'Happilee API' },
          { type: 'system', msg: 'Memory cleanup: Flushed 12 inactive buffers', meta: '0.4s' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        
        const newLog: ActivityLog = {
          id: Date.now().toString(),
          type: event.type,
          message: event.msg,
          meta: event.meta,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };

        setLogs(prev => [...prev.slice(-20), newLog]);
        setStats(prev => ({
          ...prev,
          scanned: prev.scanned + Math.floor(Math.random() * 5)
        }));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isHunting]);

  const addLog = (type: ActivityLog['type'], message: string, meta?: string) => {
    setLogs(prev => [...prev.slice(-20), {
      id: Date.now().toString(),
      type,
      message,
      meta,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const runAutopsy = async (leadId: string) => {
    addLog('ai', `Initializing Neural Autopsy`, `Lead: ${leadId}`);
    addLog('system', `Fetching conversation context...`, `Happilee DB`);
    
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'autopsy' } : l));
    setActiveLeadId(leadId);

    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      const ai = getAI();
      addLog('ai', `Analyzing customer intent & blockers`, `Gemini 3.0`);
      
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
      addLog('success', `Autopsy Complete: ${result.ghost_reason}`, `Conf: ${Math.round(result.confidence * 100)}%`);
      addLog('api', `POST /v1/messages/send`, `Status: 202`);
      
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

      setStats(prev => ({
        ...prev,
        resurrected: prev.resurrected + 1,
        conversion: Number((((prev.resurrected + 1) / (prev.scanned / 10)) * 100).toFixed(1))
      }));
    } catch (error) {
      console.error("Autopsy failed:", error);
      addLog('warning', `Neural Engine Error`, `Check API Key`);
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

        {/* Active Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Threads Scanned', value: stats.scanned.toLocaleString(), icon: Users, color: 'text-blue-400' },
            { label: 'Leads Resurrected', value: stats.resurrected, icon: Target, color: 'text-emerald-400' },
            { label: 'Conversion Rate', value: `${stats.conversion}%`, icon: TrendingUp, color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-white/20 transition-all">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-2xl bg-white/5", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Leads List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Dead Conversations</h2>
              <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">{leads.length} Found</span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
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

          {/* Live Activity Feed */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/40">Live Activity</h2>
              <Activity className={cn("w-4 h-4", isHunting ? "text-emerald-400 animate-pulse" : "text-white/20")} />
            </div>
            <div className="bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-4 h-[600px] flex flex-col font-mono">
              <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
                {logs.map((log) => (
                  <div key={log.id} className="group">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-[7px] font-black uppercase px-1 py-0.5 rounded",
                          log.type === 'system' ? "bg-blue-500/20 text-blue-400" :
                          log.type === 'api' ? "bg-emerald-500/20 text-emerald-400" :
                          log.type === 'ai' ? "bg-purple-500/20 text-purple-400" :
                          log.type === 'success' ? "bg-emerald-500/20 text-emerald-400" :
                          "bg-rose-500/20 text-rose-400"
                        )}>
                          {log.type}
                        </span>
                        {log.meta && (
                          <span className="text-[7px] text-white/20 uppercase tracking-tighter">
                            [{log.meta}]
                          </span>
                        )}
                      </div>
                      <span className="text-[7px] text-white/10">{log.time}</span>
                    </div>
                    <p className="text-[9px] text-white/50 group-hover:text-white/80 transition-colors">
                      <span className="text-white/20 mr-1">›</span>
                      {log.message}
                    </p>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
              {!isHunting && (
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[9px] text-white/30 italic">GHOST_ENGINE_IDLE: Waiting for Start Command...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
    </div>
  );
}
