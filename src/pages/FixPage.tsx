import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import CodeBlock from '@/components/CodeBlock';
import { FIX_EXPLANATION, ASCII_SECURE_FLOW } from '@/data/securityContent';
import AsciiDiagram from '@/components/AsciiDiagram';

const FixPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 terminal-glow">✅ {FIX_EXPLANATION.title}</h1>
          <p className="text-muted-foreground">One word change. Millions saved.</p>
        </motion.div>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <TerminalWindow title="BEFORE (Vulnerable)" variant="danger">
            <CodeBlock code={FIX_EXPLANATION.before.code} language="rust" className="mb-4" />
            <p className="text-sm text-destructive">{FIX_EXPLANATION.before.explanation}</p>
          </TerminalWindow>

          <TerminalWindow title="AFTER (Secure)" variant="success">
            <CodeBlock code={FIX_EXPLANATION.after.code} language="rust" className="mb-4" />
            <p className="text-sm text-success">{FIX_EXPLANATION.after.explanation}</p>
          </TerminalWindow>
        </div>

        {/* Why It Works */}
        <TerminalWindow title="why_it_works.md" className="mb-8">
          <h3 className="font-bold text-lg mb-4 text-cyber">🔬 Technical Breakdown</h3>
          <ul className="space-y-3">
            {FIX_EXPLANATION.whyItWorks.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <span className="text-terminal">{point}</span>
              </li>
            ))}
          </ul>
        </TerminalWindow>

        {/* Secure Flow Diagram */}
        <TerminalWindow title="secure_flow.diagram" variant="success" className="mb-8">
          <div className="overflow-x-auto">
            <AsciiDiagram diagram={ASCII_SECURE_FLOW} />
          </div>
        </TerminalWindow>

        {/* Golden Rule */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="p-6 bg-primary/10 border-2 border-primary rounded-lg text-center mb-8">
          <h2 className="font-display text-xl font-bold mb-2 text-primary">🎓 THE GOLDEN RULE</h2>
          <p className="text-lg text-terminal">{FIX_EXPLANATION.goldenRule}</p>
        </motion.div>

        <div className="flex justify-end">
          <Link to="/tests" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono">
            View Test Simulation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FixPage;
