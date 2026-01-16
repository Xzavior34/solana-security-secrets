import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Skull, Shield } from 'lucide-react';
import TerminalWindow from '@/components/TerminalWindow';
import { TEST_CODE } from '@/data/securityContent';
import CodeBlock from '@/components/CodeBlock';

const heistOutput = `
╔════════════════════════════════════════╗
║   🏦 VICTIM DEPOSITS INTO VAULT         ║
╚════════════════════════════════════════╝

📊 Vault Status:
├── Owner: 7xKXtg2CW87d97...
└── Balance: 10 SOL

╔════════════════════════════════════════╗
║   🥷 HACKING IN PROGRESS...              ║
╚════════════════════════════════════════╝

⏳ Attacker preparing malicious transaction...
├── Target: Victim's vault
├── Method: Pass victim pubkey without signature
└── Amount: 5 SOL

💰💰💰 FUNDS STOLEN SUCCESSFULLY! 💰💰💰

📊 Vault Status After Attack:
├── Previous Balance: 10 SOL
├── Stolen Amount: 5 SOL
└── Remaining Balance: 5 SOL

🎯 Exploit successful! The vulnerable contract didn't verify
   that the owner actually SIGNED the transaction.

    ✓ 🥷 Attacker drains vault WITHOUT owner's signature! (2847ms)
`;

const shieldOutput = `
╔════════════════════════════════════════╗
║   🏦 VICTIM DEPOSITS INTO SECURE VAULT  ║
╚════════════════════════════════════════╝

📊 Secure Vault Status:
├── Owner: 7xKXtg2CW87d97...
└── Balance: 10 SOL

🔒 This vault uses Signer<'info> for owner verification!

╔════════════════════════════════════════╗
║   🥷 ATTACK ATTEMPT ON SECURE VAULT      ║
╚════════════════════════════════════════╝

⏳ Attacker attempting same exploit...
├── Target: Victim's SECURE vault
├── Method: Pass victim pubkey without signature
└── Expected: ❌ TRANSACTION REJECTED

🛡️🛡️🛡️ ATTACK BLOCKED! 🛡️🛡️🛡️

Error: Signature verification failed

✅ The Signer<'info> constraint required the owner's
   cryptographic signature, which the attacker cannot provide!

📊 Secure Vault Status After Attack Attempt:
└── Balance: 10 SOL (UNCHANGED!)

╔════════════════════════════════════════════════════════════╗
║  🎓 LESSON LEARNED: Always use Signer<'info> for accounts  ║
║     that must authorize transactions!                       ║
╚════════════════════════════════════════════════════════════╝

    ✓ 🛑 Attacker's exploit attempt is BLOCKED! (1523ms)
`;

const TestsPage = () => {
  const [activeTest, setActiveTest] = useState<'heist' | 'shield' | null>(null);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runTest = (test: 'heist' | 'shield') => {
    setActiveTest(test);
    setIsRunning(true);
    setOutput('');
    const fullOutput = test === 'heist' ? heistOutput : shieldOutput;
    let i = 0;
    const interval = setInterval(() => {
      setOutput(fullOutput.slice(0, i));
      i += 5;
      if (i > fullOutput.length) { clearInterval(interval); setIsRunning(false); }
    }, 10);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2 terminal-glow">🧪 Test Simulation</h1>
          <p className="text-muted-foreground">Run the tests to see the exploit and defense in action.</p>
        </motion.div>

        <div className="flex gap-4 mb-6">
          <button onClick={() => runTest('heist')} disabled={isRunning} className="flex items-center gap-2 px-6 py-3 bg-destructive text-destructive-foreground rounded-lg font-mono disabled:opacity-50">
            <Skull className="w-4 h-4" /> Run Heist Test
          </button>
          <button onClick={() => runTest('shield')} disabled={isRunning} className="flex items-center gap-2 px-6 py-3 bg-success text-success-foreground rounded-lg font-mono disabled:opacity-50">
            <Shield className="w-4 h-4" /> Run Shield Test
          </button>
        </div>

        {activeTest && (
          <TerminalWindow title={`anchor test --${activeTest}`} variant={activeTest === 'heist' ? 'danger' : 'success'} className="mb-8">
            <pre className="text-sm whitespace-pre-wrap">{output}<span className="animate-blink">█</span></pre>
          </TerminalWindow>
        )}

        <TerminalWindow title="signer-auth.test.ts" className="mb-8">
          <CodeBlock code={TEST_CODE.slice(0, 2000) + '\n// ... (full file available for download)'} language="typescript" />
        </TerminalWindow>

        <div className="flex justify-end">
          <Link to="/download" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-mono">
            Download Files <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
