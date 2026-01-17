import { motion } from 'framer-motion';
import { ChevronRight, Lock, CheckCircle } from 'lucide-react';
import { useModule } from '@/context/ModuleContext';
import { getAllModules, ModuleId } from '@/data/modules';
import { cn } from '@/lib/utils';

interface ModuleSidebarProps {
  className?: string;
  completedModules?: ModuleId[];
}

const ModuleSidebar = ({ className, completedModules = [] }: ModuleSidebarProps) => {
  const { activeModule, setActiveModule } = useModule();
  const modules = getAllModules();

  return (
    <div className={cn("w-64 bg-card/50 backdrop-blur-sm border-r border-border", className)}>
      <div className="p-4 border-b border-border">
        <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">
          Security Modules
        </h2>
      </div>
      
      <nav className="p-2 space-y-1">
        {modules.map((module, index) => {
          const isActive = activeModule === module.id;
          const isCompleted = completedModules.includes(module.id);
          const isLocked = false; // Could add progression logic
          
          return (
            <motion.button
              key={module.id}
              onClick={() => !isLocked && setActiveModule(module.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all relative group",
                isActive 
                  ? "bg-primary/20 text-primary border border-primary/30" 
                  : "hover:bg-muted/50 text-muted-foreground hover:text-foreground",
                isLocked && "opacity-50 cursor-not-allowed"
              )}
              whileHover={!isLocked ? { x: 4 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
            >
              {/* Module Number */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : isCompleted 
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-muted text-muted-foreground"
              )}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : (
                  module.number
                )}
              </div>

              {/* Module Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{module.icon}</span>
                  <span className="font-mono text-sm truncate">{module.shortTitle}</span>
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {module.scenario.name}
                </div>
              </div>

              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeModuleIndicator"
                  className="absolute right-2"
                >
                  <ChevronRight className="w-4 h-4 text-primary" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Progress */}
      <div className="p-4 border-t border-border mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progress</span>
          <span>{completedModules.length}/{modules.length}</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-cyber"
            initial={{ width: 0 }}
            animate={{ width: `${(completedModules.length / modules.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleSidebar;
