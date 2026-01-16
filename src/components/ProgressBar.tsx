import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label?: string;
  variant?: 'default' | 'danger' | 'success';
  className?: string;
}

const ProgressBar = ({ 
  progress, 
  label, 
  variant = 'default',
  className = '' 
}: ProgressBarProps) => {
  const barColor = {
    default: 'bg-primary',
    danger: 'bg-destructive',
    success: 'bg-success',
  }[variant];

  const glowColor = {
    default: 'shadow-[0_0_10px_hsl(var(--primary)/0.5)]',
    danger: 'shadow-[0_0_10px_hsl(var(--destructive)/0.5)]',
    success: 'shadow-[0_0_10px_hsl(var(--success)/0.5)]',
  }[variant];

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm font-mono">
          <span className="text-muted-foreground">{label}</span>
          <span className="text-terminal">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} ${glowColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
