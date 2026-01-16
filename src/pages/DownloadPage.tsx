import { motion } from 'framer-motion';
import { Download, FileCode, FileText, TestTube, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import TerminalWindow from '@/components/TerminalWindow';
import { FULL_LIB_RS, TEST_CODE, README_CONTENT } from '@/data/securityContent';

const files = [
  { name: 'lib.rs', icon: FileCode, description: 'Complete Anchor program with vulnerable + secure modules', content: FULL_LIB_RS },
  { name: 'signer-auth.test.ts', icon: TestTube, description: 'TypeScript tests with hacking simulation', content: TEST_CODE },
  { name: 'README.md', icon: FileText, description: 'Deep dive educational documentation', content: README_CONTENT },
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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 terminal-glow">📦 Download Hub</h1>
          <p className="text-muted-foreground">Get all the files for your bounty submission.</p>
        </motion.div>

        <div className="space-y-6">
          {files.map((file, i) => (
            <motion.div key={file.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
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
                    <button onClick={() => copyToClipboard(file.content, file.name)} className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                      {copiedFile === file.name ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                      {copiedFile === file.name ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={() => downloadFile(file.content, file.name)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                      <Download className="w-4 h-4" /> Download
                    </button>
                  </div>
                </div>
                <pre className="p-4 bg-background rounded-lg text-xs overflow-x-auto max-h-48 overflow-y-auto border border-border">
                  {file.content.slice(0, 800)}...
                </pre>
              </TerminalWindow>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-12 p-8 terminal-border rounded-lg bg-card text-center">
          <h2 className="font-display text-2xl font-bold mb-4 terminal-glow">🏆 Ready for Submission!</h2>
          <p className="text-muted-foreground mb-6">You now have everything needed for the SuperteamNG Solana Security Bounty.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ lib.rs with vulnerable + secure code</div>
            <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ TypeScript tests with simulation</div>
            <div className="px-4 py-2 bg-success/20 text-success rounded-lg">✅ Educational README documentation</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadPage;
