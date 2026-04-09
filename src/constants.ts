export const GHOST_REASONS = [
  {
    reason: "Price Shock",
    signal: "Asked price → silence",
    strategy: "Reframe value, smaller entry point",
    color: "from-purple-500/20 to-purple-500/5",
    icon: "DollarSign"
  },
  {
    reason: "Got Busy",
    signal: "Mid-flow dropout, was engaged",
    strategy: "Warm callback, zero pressure",
    color: "from-blue-500/20 to-blue-500/5",
    icon: "Clock"
  },
  {
    reason: "Confused",
    signal: "Complex answer → silence",
    strategy: "Simplify to 1 question",
    color: "from-amber-500/20 to-amber-500/5",
    icon: "HelpCircle"
  },
  {
    reason: "Comparison Shopping",
    signal: "Feature Qs → vanished",
    strategy: "Urgency + differentiation",
    color: "from-emerald-500/20 to-emerald-500/5",
    icon: "Search"
  },
  {
    reason: "Polite Exit",
    signal: "'Will get back' → 2+ weeks",
    strategy: "Give them an easy out — this gets replies",
    color: "from-rose-500/20 to-rose-500/5",
    icon: "LogOut"
  },
  {
    reason: "Hard No",
    signal: "Never replied at all",
    strategy: "One last gentle attempt, then tag churned",
    color: "from-slate-500/20 to-slate-500/5",
    icon: "UserX"
  },
  {
    reason: "Timing Issue",
    signal: "Mentioned future date",
    strategy: "Calendar-aware follow-up",
    color: "from-indigo-500/20 to-indigo-500/5",
    icon: "Calendar"
  },
  {
    reason: "Watching Silently",
    signal: "Opens every msg, never replies",
    strategy: "Low-commitment Yes/No CTA",
    color: "from-cyan-500/20 to-cyan-500/5",
    icon: "Eye"
  }
];

export const TECH_STACK = [
  { name: "Groq + Llama 3.3 70B", description: "Primary LLM — faster than GPT-4, free tier" },
  { name: "Gemini 1.5 Flash", description: "Backup LLM — 1M token context, reads full conversation" },
  { name: "LangGraph", description: "Agentic loop orchestration (SCAN→AUTOPSY→STRATEGIZE→FIRE)" },
  { name: "FastAPI", description: "Backend orchestration server" },
  { name: "ChromaDB", description: "Local vector DB — stores conversation embeddings" },
  { name: "Happilee API", description: "WhatsApp gateway — abstracted behind ConversationProvider" }
];
