import { Highlight, themes } from 'prism-react-renderer';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  dangerLines?: number[];
  annotations?: Record<number, string>;
  className?: string;
}

const CodeBlock = ({
  code,
  language = 'rust',
  filename,
  highlightLines = [],
  dangerLines = [],
  annotations = {},
  className = '',
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<number | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`terminal-border rounded-lg overflow-hidden bg-card ${className}`}
    >
      {/* Header */}
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
          <span className="text-sm text-muted-foreground font-mono">{filename}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-muted transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      )}

      {/* Code */}
      <div className="relative overflow-x-auto">
        <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
          {({ className: preClassName, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${preClassName} p-4 text-sm leading-relaxed`}
              style={{ ...style, background: 'transparent' }}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1;
                const isDanger = dangerLines.includes(lineNumber);
                const isHighlight = highlightLines.includes(lineNumber);
                const hasAnnotation = annotations[lineNumber];

                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    className={`relative group ${
                      isDanger
                        ? 'bg-destructive/10 border-l-2 border-destructive'
                        : isHighlight
                        ? 'bg-success/10 border-l-2 border-success'
                        : ''
                    }`}
                    onMouseEnter={() => hasAnnotation && setActiveAnnotation(lineNumber)}
                    onMouseLeave={() => setActiveAnnotation(null)}
                  >
                    <span className="inline-block w-8 text-right mr-4 text-muted-foreground/50 select-none">
                      {lineNumber}
                    </span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                    
                    {/* Annotation Indicator */}
                    {hasAnnotation && (
                      <span className="ml-2 text-warning cursor-help">
                        💡
                      </span>
                    )}

                    {/* Annotation Popup */}
                    {activeAnnotation === lineNumber && hasAnnotation && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute left-full ml-4 top-0 z-50 w-80 p-3 rounded-lg bg-popover border border-border shadow-xl"
                      >
                        <div className="text-xs font-semibold text-warning mb-1">
                          📚 Teacher's Note
                        </div>
                        <div className="text-sm text-popover-foreground">
                          {hasAnnotation}
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </motion.div>
  );
};

export default CodeBlock;
