import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Shield, Zap } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import { DEEP_DIVE_CONTENT, getAllModules } from '@/data/modules';

const DeepDivePage = () => {
  const modules = getAllModules();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 terminal-glow">
            📖 {DEEP_DIVE_CONTENT.title}
          </h1>
          <p className="text-xl text-muted-foreground font-mono">{DEEP_DIVE_CONTENT.subtitle}</p>
        </motion.div>

        <TerminalWindow title="mental_model.md" className="mb-8">
          <p className="text-terminal whitespace-pre-wrap leading-relaxed">{DEEP_DIVE_CONTENT.introduction}</p>
        </TerminalWindow>

        {/* CEI Sections */}
        <div className="space-y-6 mb-12">
          {DEEP_DIVE_CONTENT.sections.map((section, i) => (
            <motion.div key={section.title} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <TerminalWindow title={`step_${i + 1}.md`} variant={i === 0 ? 'cyber' : i === 1 ? 'success' : 'default'}>
                <h3 className="font-bold text-lg mb-3 text-primary">{section.title}</h3>
                <pre className="text-terminal whitespace-pre-wrap text-sm">{section.content}</pre>
                <div className="mt-4 flex flex-wrap gap-2">
                  {section.vulnerabilities.map(v => {
                    const mod = modules.find(m => m.id === v);
                    return mod ? (
                      <span key={v} className="px-2 py-1 bg-muted rounded text-xs font-mono">
                        {mod.icon} {mod.shortTitle}
                      </span>
                    ) : null;
                  })}
                </div>
              </TerminalWindow>
            </motion.div>
          ))}
        </div>

        {/* Framework Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-display text-2xl font-bold mb-6 terminal-glow">⚔️ {DEEP_DIVE_CONTENT.frameworkComparison.title}</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <TerminalWindow title="anchor.comparison" variant="success">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-success" />
                <h3 className="font-bold text-lg">{DEEP_DIVE_CONTENT.frameworkComparison.anchor.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{DEEP_DIVE_CONTENT.frameworkComparison.anchor.philosophy}</p>
              <div className="space-y-2">
                {DEEP_DIVE_CONTENT.frameworkComparison.anchor.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </TerminalWindow>

            <TerminalWindow title="pinocchio.comparison" variant="cyber">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-6 h-6 text-cyber" />
                <h3 className="font-bold text-lg">{DEEP_DIVE_CONTENT.frameworkComparison.pinocchio.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{DEEP_DIVE_CONTENT.frameworkComparison.pinocchio.philosophy}</p>
              <div className="space-y-2">
                {DEEP_DIVE_CONTENT.frameworkComparison.pinocchio.pros.map((pro, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-cyber shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
            </TerminalWindow>
          </div>
          
          <TerminalWindow title="verdict.md" className="mb-8">
            <pre className="text-terminal whitespace-pre-wrap text-sm">{DEEP_DIVE_CONTENT.frameworkComparison.verdict}</pre>
          </TerminalWindow>
        </motion.div>

        {/* Security Checklist */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 className="font-display text-2xl font-bold mb-6 terminal-glow">✅ Security Checklist</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEEP_DIVE_CONTENT.checklist.map((category, i) => (
              <TerminalWindow key={category.category} title={category.category.toLowerCase().replace(' ', '_')}>
                <h4 className="font-bold text-sm mb-3">{category.category}</h4>
                <ul className="space-y-2">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs">
                      <span className="text-success">✓</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </TerminalWindow>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DeepDivePage;
