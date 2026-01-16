import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'success' | 'cyber';
}

const TerminalWindow = ({ 
  title = "terminal", 
  children, 
  className = "",
  variant = 'default'
}: TerminalWindowProps) => {
  const borderClass = {
    default: 'terminal-border',
    danger: 'danger-border',
    success: 'terminal-border',
    cyber: 'cyber-border',
  }[variant];

  const dotColors = {
    default: ['bg-destructive', 'bg-warning', 'bg-success'],
    danger: ['bg-destructive', 'bg-destructive/50', 'bg-destructive/30'],
    success: ['bg-success', 'bg-success/50', 'bg-success/30'],
    cyber: ['bg-cyber', 'bg-cyber/50', 'bg-cyber/30'],
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${borderClass} rounded-lg overflow-hidden bg-card ${className}`}
    >
      {/* Title Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex gap-2">
          <div className={`w-3 h-3 rounded-full ${dotColors[0]}`} />
          <div className={`w-3 h-3 rounded-full ${dotColors[1]}`} />
          <div className={`w-3 h-3 rounded-full ${dotColors[2]}`} />
        </div>
        <span className="ml-2 text-sm text-muted-foreground font-mono">
          {title}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </motion.div>
  );
};

export default TerminalWindow;
