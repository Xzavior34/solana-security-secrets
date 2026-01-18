import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import CodeBlock from '@/components/CodeBlock';
import AsciiDiagram from '@/components/AsciiDiagram';
import ModuleSidebar from '@/components/ModuleSidebar';
import ModuleNavigator from '@/components/ModuleNavigator';
import { useModule } from '@/context/ModuleContext';
import { SECURITY_MODULES } from '@/data/modules';

const FixPage = () => {
  const { activeModule } = useModule();
  const module = SECURITY_MODULES[activeModule];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="flex">
        <ModuleSidebar />
        
        <div className="flex-1 container mx-auto px-4 max-w-5xl">
          <motion.div 
            key={activeModule}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 10px hsl(var(--success)))',
                    'drop-shadow(0 0 20px hsl(var(--success)))',
                    'drop-shadow(0 0 10px hsl(var(--success)))',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-8 h-8 text-success" />
              </motion.div>
              <h1 className="font-display text-3xl font-bold terminal-glow">
                ✅ {module.fix.title}
              </h1>
            </div>
            <p className="text-muted-foreground">The fix that saves millions.</p>
          </motion.div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <TerminalWindow title="BEFORE (Vulnerable)" variant="danger">
              <CodeBlock code={module.fix.before.code} language="rust" className="mb-4" />
              <p className="text-sm text-destructive">{module.fix.before.explanation}</p>
            </TerminalWindow>

            <TerminalWindow title="AFTER (Secure)" variant="success">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CodeBlock code={module.fix.after.code} language="rust" className="mb-4" />
                <p className="text-sm text-success">{module.fix.after.explanation}</p>
              </motion.div>
            </TerminalWindow>
          </div>

          {/* Why It Works */}
          <TerminalWindow title="why_it_works.md" className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-cyber">🔬 Technical Breakdown</h3>
            <ul className="space-y-3">
              {module.fix.whyItWorks.map((point, i) => (
                <motion.li 
                  key={i} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ delay: i * 0.1 + 0.5, duration: 0.3 }}
                  >
                    <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  </motion.div>
                  <span className="text-terminal">{point}</span>
                </motion.li>
              ))}
            </ul>
          </TerminalWindow>

          {/* Secure Flow Diagram */}
          <TerminalWindow title="secure_flow.diagram" variant="success" className="mb-8">
            <div className="overflow-x-auto">
              <AsciiDiagram diagram={module.asciiSecure} />
            </div>
          </TerminalWindow>

          {/* Golden Rule */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.3 }} 
            className="p-6 bg-primary/10 border-2 border-primary rounded-lg text-center mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px hsl(var(--primary) / 0.3)',
                  '0 0 40px hsl(var(--primary) / 0.5)',
                  '0 0 20px hsl(var(--primary) / 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block px-6 py-4 rounded-lg"
            >
              <h2 className="font-display text-xl font-bold mb-2 text-primary">🎓 THE GOLDEN RULE</h2>
              <p className="text-lg text-terminal">{module.fix.goldenRule}</p>
            </motion.div>
          </motion.div>

          {/* Pinocchio Comparison */}
          <TerminalWindow title="pinocchio_comparison.md" variant="cyber" className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-cyber">🔧 Anchor vs Pinocchio</h3>
            <CodeBlock code={module.pinocchio.comparison} language="rust" className="mb-4" />
            <div className="flex items-center gap-4 mt-4">
              <span className={`px-3 py-1 rounded-full text-sm font-mono ${
                module.pinocchio.difficulty === 'easier' 
                  ? 'bg-success/20 text-success' 
                  : module.pinocchio.difficulty === 'harder'
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-warning/20 text-warning'
              }`}>
                Pinocchio: {module.pinocchio.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-muted-foreground mt-2">{module.pinocchio.verdict}</p>
          </TerminalWindow>

          <ModuleNavigator />

          <div className="flex justify-end mt-6">
            <Link 
              to="/tests" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono hover:bg-primary/90 transition-colors"
            >
              View Test Simulation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixPage;
