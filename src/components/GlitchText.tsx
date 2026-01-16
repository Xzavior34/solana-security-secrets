import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  variant?: 'danger' | 'warning' | 'default';
}

const GlitchText = ({ text, className = '', variant = 'default' }: GlitchTextProps) => {
  const colorClass = {
    danger: 'text-destructive danger-glow',
    warning: 'text-warning',
    default: 'text-terminal terminal-glow',
  }[variant];

  return (
    <motion.span
      className={`relative inline-block ${colorClass} ${className}`}
      animate={{
        textShadow: [
          '0 0 10px currentColor',
          '2px 0 10px currentColor, -2px 0 10px currentColor',
          '0 0 10px currentColor',
        ],
      }}
      transition={{
        duration: 0.1,
        repeat: Infinity,
        repeatDelay: 3,
      }}
    >
      {text}
    </motion.span>
  );
};

export default GlitchText;
