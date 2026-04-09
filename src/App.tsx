import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ghost, 
  Zap, 
  ArrowRight, 
  MessageSquare, 
  Bot, 
  BarChart3, 
  ShieldCheck,
  ExternalLink,
  Github,
  Instagram,
  Linkedin
} from 'lucide-react';
import Logo from './components/Logo';
import ChatPreview from './components/ChatPreview';
import GhostReasonCard from './components/GhostReasonCard';
import DemoDashboard from './components/DemoDashboard';
import LiveChat from './components/LiveChat';
import { GHOST_REASONS, TECH_STACK } from './constants';
import { cn } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  if (view === 'dashboard') {
    return <DemoDashboard onBack={() => setView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] selection:bg-purple-500/30">
      {/* Atmosphere Background */}
      <div className="fixed inset-0 bg-atmosphere pointer-events-none z-0" />

      {/* Live Chat Playground */}
      <LiveChat />

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10 text-purple-500" />
            <span className="text-xl font-bold tracking-tighter text-glow">GHOST</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-white/60 hover:text-white transition-colors">How it Works</a>
            <a href="#engine" className="text-sm text-white/60 hover:text-white transition-colors">Reason Engine</a>
            <a href="#stack" className="text-sm text-white/60 hover:text-white transition-colors">Tech Stack</a>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('dashboard')}
            className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-purple-400 transition-colors"
          >
            Launch Dashboard
          </motion.button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="w-3 h-3 fill-current" />
              Autonomous Lead Resurrection
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-glow"
            >
              YOUR LEADS AREN'T GONE. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                THEY'RE JUST HAUNTING YOU.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
            >
              GHOST is an autonomous AI agent that hunts down abandoned WhatsApp conversations, 
              diagnoses why they went cold, and resurrects them with hyper-personalized messaging.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all border-glow"
              >
                Start Resurrecting
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold transition-all"
              >
                View Live Demo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Live Demo / How it Works */}
        <section id="how-it-works" className="py-20 px-6 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold tracking-tight">The Magic Stack</h2>
                  <p className="text-white/60 text-lg">
                    GHOST doesn't just "follow up." It performs a conversation autopsy to understand the emotional state of your lead.
                  </p>
                </div>

                <div className="space-y-6">
                  {[
                    { icon: Ghost, title: "Autopsy Engine", desc: "Classifies why the person went silent: Price? Busy? Confused?" },
                    { icon: Bot, title: "Tone Mirroring", desc: "Matches vocabulary, emoji usage, and formality level of the lead." },
                    { icon: Zap, title: "Golden Window", desc: "Sends messages when the customer is most likely to be active." },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                        <item.icon className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white">{item.title}</h4>
                        <p className="text-sm text-white/40">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-purple-500/20 blur-3xl rounded-full opacity-50" />
                <ChatPreview 
                  title="Sarah Jenkins"
                  messages={[
                    { role: 'user', text: "Hey! I saw your ad for the premium plan. How much is it?", time: "2 days ago" },
                    { role: 'agent', text: "It's $499/mo for the full suite!", time: "2 days ago" },
                    { role: 'ghost', text: "[Sarah went silent]", time: "Seen 48h ago" },
                  ]}
                  autopsy={{
                    reason: "Price Shock",
                    strategy: "Value Reframe + Pilot Offer",
                    confidence: 0.94
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Reason Engine Grid */}
        <section id="engine" className="py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold tracking-tight">GHOST Reason Engine</h2>
              <p className="text-white/60 max-w-2xl mx-auto">
                Our agentic loop identifies the exact friction point and selects the strategy 
                your best salesperson would use.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {GHOST_REASONS.map((reason, i) => (
                <GhostReasonCard key={i} {...reason} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="py-20 px-6 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight">Built for Performance</h2>
                <p className="text-white/60">
                  We leverage a 100% free-tier AI stack that delivers enterprise-grade accuracy 
                  without the overhead.
                </p>
                <div className="grid gap-4">
                  {TECH_STACK.map((tech, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <div>
                        <p className="text-sm font-bold text-white">{tech.name}</p>
                        <p className="text-xs text-white/40">{tech.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: BarChart3, label: "80%", sub: "Lead Recovery" },
                  { icon: Zap, label: "< 2min", sub: "Setup Time" },
                  { icon: ShieldCheck, label: "100%", sub: "Autonomous" },
                  { icon: MessageSquare, label: "24/7", sub: "Active Hunting" },
                ].map((stat, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 text-center space-y-2">
                    <stat.icon className="w-8 h-8 text-purple-500 mx-auto mb-4" />
                    <p className="text-3xl font-black text-white">{stat.label}</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-5xl mx-auto p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-purple-600 to-blue-700 text-center space-y-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/ghost/1920/1080')] opacity-10 mix-blend-overlay" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight relative z-10">
              READY TO RESURRECT <br /> YOUR REVENUE?
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto relative z-10">
              Join 500+ businesses using GHOST to turn "Seen" into "Sold".
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-bold hover:bg-purple-100 transition-all shadow-xl"
              >
                Get Started Free
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="w-full sm:w-auto bg-black/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-bold hover:bg-black/30 transition-all"
              >
                Talk to Sales
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Logo className="w-8 h-8 text-purple-500" />
            <span className="text-lg font-bold tracking-tighter">GHOST</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Happilee Integration</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/jm_0_7_7?igsh=MWRuYXA5YjBycjRvdg==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://github.com/joble5898-jm" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/joel-mathew-0b01b1370?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-xs text-white/20">
          © 2026 GHOST AI. Built by GHOST.
        </div>
      </footer>
    </div>
  );
}
