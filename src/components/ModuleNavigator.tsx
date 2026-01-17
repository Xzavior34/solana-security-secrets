import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useModule } from '@/context/ModuleContext';
import { getModule, MODULE_ORDER } from '@/data/modules';
import { cn } from '@/lib/utils';

interface ModuleNavigatorProps {
  className?: string;
}

const ModuleNavigator = ({ className }: ModuleNavigatorProps) => {
  const { activeModule, nextModule, prevModule, hasNext, hasPrev, moduleIndex } = useModule();
  const currentModule = getModule(activeModule);
  
  const prevModuleData = hasPrev ? getModule(MODULE_ORDER[moduleIndex - 1]) : null;
  const nextModuleData = hasNext ? getModule(MODULE_ORDER[moduleIndex + 1]) : null;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Previous */}
      <motion.button
        onClick={prevModule}
        disabled={!hasPrev}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
          hasPrev 
            ? "bg-muted hover:bg-muted/80 text-foreground" 
            : "opacity-30 cursor-not-allowed"
        )}
        whileHover={hasPrev ? { x: -4 } : {}}
      >
        <ChevronLeft className="w-4 h-4" />
        <div className="text-left hidden sm:block">
          <div className="text-xs text-muted-foreground">Previous</div>
          <div className="text-sm font-mono">
            {prevModuleData ? `${prevModuleData.icon} ${prevModuleData.shortTitle}` : '—'}
          </div>
        </div>
      </motion.button>

      {/* Current Module Indicator */}
      <div className="flex items-center gap-2">
        {MODULE_ORDER.map((id, i) => (
          <motion.div
            key={id}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              id === activeModule 
                ? "bg-primary w-6" 
                : "bg-muted-foreground/30"
            )}
            layoutId={`dot-${id}`}
          />
        ))}
      </div>

      {/* Next */}
      <motion.button
        onClick={nextModule}
        disabled={!hasNext}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
          hasNext 
            ? "bg-primary text-primary-foreground hover:bg-primary/90" 
            : "opacity-30 cursor-not-allowed"
        )}
        whileHover={hasNext ? { x: 4 } : {}}
      >
        <div className="text-right hidden sm:block">
          <div className="text-xs opacity-80">Next Module</div>
          <div className="text-sm font-mono">
            {nextModuleData ? `${nextModuleData.icon} ${nextModuleData.shortTitle}` : 'Complete!'}
          </div>
        </div>
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default ModuleNavigator;
