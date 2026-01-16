import { motion } from 'framer-motion';

interface AsciiDiagramProps {
  diagram: string;
  className?: string;
  animated?: boolean;
}

const AsciiDiagram = ({ diagram, className = '', animated = true }: AsciiDiagramProps) => {
  const lines = diagram.split('\n');

  if (!animated) {
    return (
      <pre className={`font-mono text-sm text-terminal whitespace-pre ${className}`}>
        {diagram}
      </pre>
    );
  }

  return (
    <div className={`font-mono text-sm text-terminal whitespace-pre ${className}`}>
      {lines.map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="terminal-glow"
        >
          {line || ' '}
        </motion.div>
      ))}
    </div>
  );
};

export default AsciiDiagram;
