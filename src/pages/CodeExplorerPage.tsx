import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import CodeBlock from '@/components/CodeBlock';
import ModuleSidebar from '@/components/ModuleSidebar';
import ModuleNavigator from '@/components/ModuleNavigator';
import Quiz from '@/components/Quiz';
import { useModule } from '@/context/ModuleContext';
import { getModule } from '@/data/modules';

const CodeExplorerPage = () => {
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'secure'>('vulnerable');
  const { activeModule } = useModule();
  const module = getModule(activeModule);

  return (
    <div className="min-h-screen pt-16 flex">
      <ModuleSidebar className="hidden lg:block fixed left-0 top-16 bottom-0" />
      
      <div className="flex-1 lg:ml-64 pt-8 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div 
            key={activeModule}
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2 terminal-glow">
              {module.icon} Code Explorer - {module.shortTitle}
            </h1>
            <p className="text-muted-foreground">Compare vulnerable and secure implementations. Hover over 💡 for Teacher's Notes.</p>
          </motion.div>

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('vulnerable')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                activeTab === 'vulnerable' ? 'bg-destructive/20 text-destructive border border-destructive/50' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              🔴 Vulnerable
            </button>
            <button
              onClick={() => setActiveTab('secure')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                activeTab === 'secure' ? 'bg-success/20 text-success border border-success/50' : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              🟢 Secure
            </button>
          </div>

          {/* Code Display */}
          <motion.div 
            key={`${activeModule}-${activeTab}`} 
            initial={{ opacity: 0, x: activeTab === 'vulnerable' ? -20 : 20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <CodeBlock
              code={activeTab === 'vulnerable' ? module.vulnerableCode : module.secureCode}
              language="rust"
              filename={activeTab === 'vulnerable' ? 'lib.rs (VULNERABLE)' : 'lib.rs (SECURE)'}
              dangerLines={activeTab === 'vulnerable' ? module.dangerLines : []}
              highlightLines={activeTab === 'secure' ? module.secureLines : []}
              annotations={module.annotations}
            />
          </motion.div>

          {/* Quiz Section */}
          <Quiz
            question={module.quiz.question}
            codeSnippet={module.quiz.codeSnippet}
            options={module.quiz.options}
            correctLine={module.quiz.correctLine}
            explanation={module.quiz.explanation}
            className="mb-8"
          />

          <ModuleNavigator className="mb-6" />

          <div className="flex justify-end">
            <Link to="/exploit" className="inline-flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-mono hover:bg-destructive/90">
              See The Exploit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExplorerPage;
