import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, BookOpen, Code, Skull, CheckCircle, Terminal, Download } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/scenario', label: 'Scenario', icon: BookOpen },
  { path: '/code', label: 'Code', icon: Code },
  { path: '/exploit', label: 'Exploit', icon: Skull },
  { path: '/fix', label: 'Fix', icon: CheckCircle },
  { path: '/tests', label: 'Tests', icon: Terminal },
  { path: '/download', label: 'Download', icon: Download },
];

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-8 h-8 text-primary" />
            </motion.div>
            <span className="font-display font-bold text-lg text-terminal terminal-glow hidden sm:block">
              SOLANA SECURITY
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-terminal'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-md border border-primary/30"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
