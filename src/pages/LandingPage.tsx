import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Terminal, Code, Skull } from 'lucide-react';
import TypingText from '@/components/TypingText';
import MatrixRain from '@/components/MatrixRain';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <MatrixRain opacity={0.03} />
      
      <div className="relative z-10 container mx-auto px-4 pt-24 pb-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-20 h-20 text-primary" />
            </motion.div>
          </div>

          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 terminal-glow">
            <TypingText text="SOLANA SECURITY ACADEMY" speed={40} />
          </h1>

          <p className="text-xl text-muted-foreground mb-2 font-mono">
            &gt; Module: <span className="text-destructive">SIGNER_AUTHORIZATION</span>
          </p>
          <p className="text-lg text-terminal-dim mb-8">
            Learn how missing signature checks can drain millions
          </p>

          <Link
            to="/scenario"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-mono font-semibold hover:bg-primary/90 transition-all animate-glow-pulse"
          >
            <Terminal className="w-5 h-5" />
            Enter The Vault
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
        >
          {[
            { icon: Code, title: "Interactive Code", desc: "Annotated vulnerable & secure code with Teacher's Notes" },
            { icon: Skull, title: "Live Exploit Demo", desc: "Watch the attack unfold step-by-step" },
            { icon: Shield, title: "The Fix", desc: "One word that saves millions in funds" },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="terminal-border rounded-lg p-6 bg-card/50 backdrop-blur-sm"
            >
              <card.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-display font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ASCII Art */}
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-xs text-terminal-dim font-mono hidden md:block"
        >
{`
   _____ ____  _        _    _   _    _      ____  _____ ____  _   _ ____  ___ _______   __
  / ____/ __ \\| |      / \\  | \\ | |  / \\    / ___|| ____/ ___|_| | |  _ \\|_ _|_   _\\ \\ / /
  \\___ \\ |  | | |     / _ \\ |  \\| | / _ \\   \\___ \\|  _|| |   | | | | |_) || |  | |  \\ V / 
   ___) | |_| | |___ / ___ \\| |\\  |/ ___ \\   ___) | |__| |___| |_| |  _ < | |  | |   | |  
  |____/ \\____/_____/_/   \\_\\_| \\_/_/   \\_\\ |____/|_____\\____|\\___/|_| \\_\\___| |_|   |_|  
`}
        </motion.pre>
      </div>
    </div>
  );
};

export default LandingPage;
