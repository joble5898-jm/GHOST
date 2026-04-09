import { motion } from 'motion/react';
import { CheckCheck, Ghost, MessageSquare, Zap } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Message {
  role: 'user' | 'agent' | 'ghost';
  text: string;
  time: string;
}

interface ChatPreviewProps {
  title: string;
  messages: Message[];
  autopsy?: {
    reason: string;
    strategy: string;
    confidence: number;
  };
}

export default function ChatPreview({ title, messages, autopsy }: ChatPreviewProps) {
  return (
    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">{title}</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">WhatsApp Lead</p>
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
          <div className="w-2 h-2 rounded-full bg-white/10" />
        </div>
      </div>

      <div className="p-4 space-y-4 min-h-[300px] flex flex-col">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "max-w-[80%] p-3 rounded-2xl text-sm relative",
              msg.role === 'user' 
                ? "bg-white/10 text-white self-start rounded-tl-none" 
                : msg.role === 'agent'
                ? "bg-purple-600 text-white self-end rounded-tr-none"
                : "bg-white/5 border border-white/10 text-white/60 self-center italic text-xs"
            )}
          >
            {msg.text}
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] opacity-50">{msg.time}</span>
              {msg.role === 'agent' && <CheckCheck className="w-3 h-3 text-blue-400" />}
            </div>
          </motion.div>
        ))}

        {autopsy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: messages.length * 0.1 + 0.5 }}
            className="mt-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl space-y-3"
          >
            <div className="flex items-center gap-2 text-purple-400">
              <Ghost className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">GHOST Autopsy Engine</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] text-white/40 uppercase">Reason</p>
                <p className="text-xs font-medium text-white">{autopsy.reason}</p>
              </div>
              <div>
                <p className="text-[9px] text-white/40 uppercase">Confidence</p>
                <p className="text-xs font-medium text-emerald-400">{(autopsy.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase">Strategy</p>
              <p className="text-xs font-medium text-purple-300">{autopsy.strategy}</p>
            </div>
          </motion.div>
        )}

        {autopsy && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: messages.length * 0.1 + 1.2 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl text-sm text-white self-end rounded-tr-none shadow-lg shadow-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 fill-current" />
              <span className="text-[10px] font-bold uppercase">Resurrection Message</span>
            </div>
            <p>Hey! We were talking about the pricing earlier — I totally get that it's a big decision. What if we started with a smaller pilot phase to see the ROI first?</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[9px] opacity-50">Just now</span>
              <CheckCheck className="w-3 h-3 text-white" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
