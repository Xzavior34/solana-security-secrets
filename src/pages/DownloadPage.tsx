import { motion } from 'framer-motion';
import { Download, FileCode, FileText, TestTube, Copy, Check, Package } from 'lucide-react';
import { useState } from 'react';
import TerminalWindow from '@/components/TerminalWindow';
import ModuleSidebar from '@/components/ModuleSidebar';
import { FULL_LIB_RS_ALL_MODULES, FULL_README_ALL_MODULES, FULL_TEST_CODE_ALL_MODULES, MODULE_ORDER, SECURITY_MODULES } from '@/data/modules';

const files = [
  { 
    name: 'lib.rs', 
    icon: FileCode, 
    description: 'Complete Anchor program with all 5 vulnerability modules', 
    content: FULL_LIB_RS_ALL_MODULES 
  },
  { 
    name: 'exploit_test.ts', 
    icon: TestTube, 
    description: 'TypeScript test suite with all exploit & defense simulations', 
    content: FULL_TEST_CODE_ALL_MODULES 
  },
  { 
    name: 'README.md', 
    icon: FileText, 
    description: 'Complete educational documentation with security mental model', 
    content: FULL_README_ALL_MODULES 
  },
];

const DownloadPage = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  const copyToClipboard = async (content: string, filename: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    files.forEach((file, i) => {
      setTimeout(() => downloadFile(file.content, file.name), i * 300);
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="flex">
        <ModuleSidebar />
        
        <div className="flex-1 container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold mb-2 terminal-glow">📦 Download Hub</h1>
            <p className="text-muted-foreground">Get all the files for your bounty submission.</p>
          </motion.div>

          {/* Module Checklist */}
          <TerminalWindow title="modules_included.txt" className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-cyber">✅ All 5 Modules Included</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {MODULE_ORDER.map((moduleId) => {
                const mod = SECURITY_MODULES[moduleId];
                return (
                  <motion.div
                    key={moduleId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 p-2 bg-success/10 rounded"
                  >
                    <span className="text-success">✓</span>
                    <span className="text-lg">{mod.icon}</span>
                    <span className="font-mono text-sm">{mod.title}</span>
                  </motion.div>
                );
              })}
            </div>
          </TerminalWindow>

          {/* Download All Button */}
          <motion.button
            onClick={downloadAll}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-8 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-cyber text-primary-foreground rounded-lg font-mono text-lg"
          >
            <Package className="w-6 h-6" />
            Download All Files
          </motion.button>

          {/* Individual Files */}
          <div className="space-y-6">
            {files.map((file, i) => (
              <motion.div 
                key={file.name} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
              >
                <TerminalWindow title={file.name}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <file.icon className="w-8 h-8 text-primary" />
                      <div>
                        <h3 className="font-bold">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">{file.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => copyToClipboard(file.content, file.name)} 
                        className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      >
                        {copiedFile === file.name ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        {copiedFile === file.name ? 'Copied!' : 'Copy'}
                      </button>
                      <button 
                        onClick={() => downloadFile(file.content, file.name)} 
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download
                      </button>
                    </div>
                  </div>
                  <pre className="p-4 bg-background rounded-lg text-xs overflow-x-auto max-h-48 overflow-y-auto border border-border font-mono">
                    {file.content.slice(0, 1000)}...
                  </pre>
                </TerminalWindow>
              </motion.div>
            ))}
          </div>

          {/* Ready Section */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }} 
            className="mt-12 p-8 terminal-border rounded-lg bg-card text-center"
          >
            <motion.h2 
              className="font-display text-2xl font-bold mb-4 terminal-glow"
              animate={{
                textShadow: [
                  '0 0 10px hsl(var(--terminal))',
                  '0 0 20px hsl(var(--terminal))',
                  '0 0 10px hsl(var(--terminal))',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🏆 Ready for Submission!
            </motion.h2>
            <p className="text-muted-foreground mb-6">
              You now have everything needed for the SuperteamNG Solana Security Bounty.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ lib.rs with all 5 modules</div>
              <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ Complete test suite</div>
              <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ Full documentation</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
