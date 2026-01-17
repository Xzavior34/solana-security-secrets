import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import AsciiDiagram from '@/components/AsciiDiagram';
import ModuleSidebar from '@/components/ModuleSidebar';
import ModuleNavigator from '@/components/ModuleNavigator';
import { useModule } from '@/context/ModuleContext';
import { getModule } from '@/data/modules';

const ScenarioPage = () => {
  const { activeModule } = useModule();
  const module = getModule(activeModule);

  return (
    <div className="min-h-screen pt-16 flex">
      <ModuleSidebar className="hidden lg:block fixed left-0 top-16 bottom-0" />
      
      <div className="flex-1 lg:ml-64 pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            key={activeModule}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 terminal-glow">
              {module.icon} {module.scenario.name}
            </h1>
            <p className="text-muted-foreground mb-8">{module.scenario.subtitle}</p>
          </motion.div>

          <TerminalWindow title="scenario.txt" className="mb-8">
            <p className="text-terminal whitespace-pre-wrap leading-relaxed">
              {module.scenario.description}
            </p>
          </TerminalWindow>

          <TerminalWindow title="analogy.md" variant="cyber" className="mb-8">
            <h3 className="text-cyber font-bold mb-3">🚗 {module.scenario.analogy.title}</h3>
            <p className="text-terminal whitespace-pre-wrap">{module.scenario.analogy.content}</p>
          </TerminalWindow>

          <TerminalWindow title="attack_flow.diagram" variant="danger" className="mb-8">
            <div className="overflow-x-auto">
              <AsciiDiagram diagram={module.asciiAttack} />
            </div>
          </TerminalWindow>

          <ModuleNavigator className="mb-6" />

          <div className="flex justify-end">
            <Link
              to="/code"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono hover:bg-primary/90 transition-all"
            >
              View The Code <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPage;
