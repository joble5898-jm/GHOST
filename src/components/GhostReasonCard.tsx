import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface GhostReasonCardProps {
  reason: string;
  signal: string;
  strategy: string;
  color: string;
  icon: string;
  index: number;
}

export default function GhostReasonCard({ reason, signal, strategy, color, icon, index }: GhostReasonCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "p-6 rounded-2xl border border-white/10 bg-gradient-to-br transition-all duration-300",
        color
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-mono text-white/20">0{index + 1}</span>
      </div>
      
      <h3 className="text-lg font-bold text-white mb-1">{reason}</h3>
      <div className="space-y-3">
        <div>
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Signal</p>
          <p className="text-sm text-white/80 leading-relaxed">{signal}</p>
        </div>
        <div className="pt-3 border-t border-white/5">
          <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Strategy</p>
          <p className="text-sm font-medium text-purple-400 leading-relaxed">{strategy}</p>
        </div>
      </div>
    </motion.div>
  );
}
