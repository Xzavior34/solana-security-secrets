import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Skull, Shield } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import CodeBlock from '@/components/CodeBlock';
import ModuleSidebar from '@/components/ModuleSidebar';
import ModuleNavigator from '@/components/ModuleNavigator';
import ExploitAnimation from '@/components/ExploitAnimation';
import { useModule } from '@/context/ModuleContext';
import { SECURITY_MODULES } from '@/data/modules';

const TestsPage = () => {
  const { activeModule } = useModule();
  const module = SECURITY_MODULES[activeModule];
  
  const [activeTest, setActiveTest] = useState<'heist' | 'shield' | null>(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'exploit' | 'defense'>('exploit');

  // Reset when module changes
  useEffect(() => {
    setActiveTest(null);
    setOutput('');
    setIsRunning(false);
  }, [activeModule]);

  const runTest = (test: 'heist' | 'shield') => {
    setActiveTest(test);
    setIsRunning(true);
    setOutput('');
    
    const fullOutput = test === 'heist' ? module.hackerLogs : module.shieldLogs;
    let i = 0;
    
    const interval = setInterval(() => {
      setOutput(fullOutput.slice(0, i));
      i += 3;
      if (i > fullOutput.length) {
        clearInterval(interval);
        setIsRunning(false);
        setAnimationType(test === 'heist' ? 'exploit' : 'defense');
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2500);
      }
    }, 15);
  };

  const testSnippet = `describe("${module.icon} Module ${module.number}: ${module.title}", () => {
  it("🥷 EXPLOIT: Demonstrates the vulnerability", async () => {
    // ${module.scenario.name}
    console.log("Attempting exploit...");
    // Vulnerable code allows attack
  });

  it("🛡️ DEFENSE: Shows the fix in action", async () => {
    // Secure version blocks attack
    console.log("Attack blocked!");
  });
});`;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <ExploitAnimation isSuccess={animationType === 'exploit'} isActive={showAnimation} />
      
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
              <span className="text-3xl">{module.icon}</span>
              <h1 className="font-display text-3xl font-bold terminal-glow">
                🧪 Test Simulation: {module.shortTitle}
              </h1>
            </div>
            <p className="text-muted-foreground">Run the tests to see the exploit and defense in action.</p>
          </motion.div>

          {/* Test Buttons */}
          <div className="flex gap-4 mb-6">
            <motion.button 
              onClick={() => runTest('heist')} 
              disabled={isRunning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-mono disabled:opacity-50 transition-colors"
            >
              <Skull className="w-4 h-4" /> Run Heist Test
            </motion.button>
            <motion.button 
              onClick={() => runTest('shield')} 
              disabled={isRunning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg font-mono disabled:opacity-50 transition-colors"
            >
              <Shield className="w-4 h-4" /> Run Shield Test
            </motion.button>
          </div>

          {/* Test Output */}
          {activeTest && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TerminalWindow 
                title={`anchor test --${activeTest} --module=${module.id}`} 
                variant={activeTest === 'heist' ? 'danger' : 'success'} 
                className="mb-8"
              >
                <pre className={`text-sm whitespace-pre-wrap ${
                  activeTest === 'heist' ? 'text-destructive' : 'text-success'
                }`}>
                  {output}
                  {isRunning && <span className="animate-blink">█</span>}
                </pre>
              </TerminalWindow>
            </motion.div>
          )}

          {/* Test Code Preview */}
          <TerminalWindow title={`${module.id}.test.ts`} className="mb-8">
            <CodeBlock code={testSnippet} language="typescript" />
          </TerminalWindow>

          <ModuleNavigator />

          <div className="flex justify-end mt-6">
            <Link 
              to="/download" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono hover:bg-primary/90 transition-colors"
            >
              Download Files <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
