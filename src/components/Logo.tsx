import { motion } from 'motion/react';

export default function Logo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <motion.div 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <motion.path
          d="M50 15C32 15 18 28 18 48V82C18 84.5 20.5 86 23 84.5L32 78L41 84.5C43.5 86 47.5 86 50 84.5L59 78L68 84.5C70.5 86 74.5 86 77 84.5L82 82V48C82 28 68 15 50 15Z"
          fill="url(#ghostGradient)"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        {/* Eyes */}
        <motion.circle 
          cx="38" cy="48" r="4" fill="white" 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        />
        <motion.circle 
          cx="62" cy="48" r="4" fill="white" 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
        />
        {/* Mouth */}
        <motion.path
          d="M44 64C44 64 47 67 50 67C53 67 56 64 56 64"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        />
      </svg>
    </motion.div>
  );
}
