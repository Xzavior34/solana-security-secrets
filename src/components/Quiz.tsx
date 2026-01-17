import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, XCircle, Lightbulb, RotateCcw } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import { cn } from '@/lib/utils';

interface QuizOption {
  line: number;
  text: string;
}

interface QuizProps {
  question: string;
  codeSnippet: string;
  options: QuizOption[];
  correctLine: number;
  explanation: string;
  onComplete?: (correct: boolean) => void;
  className?: string;
}

const Quiz = ({
  question,
  codeSnippet,
  options,
  correctLine,
  explanation,
  onComplete,
  className
}: QuizProps) => {
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const isCorrect = selectedLine === correctLine;

  const handleSubmit = () => {
    if (selectedLine === null) return;
    setShowResult(true);
    setAttempts(prev => prev + 1);
    onComplete?.(isCorrect);
  };

  const handleReset = () => {
    setSelectedLine(null);
    setShowResult(false);
  };

  const codeLines = codeSnippet.trim().split('\n');

  return (
    <TerminalWindow 
      title="quiz.challenge" 
      variant={showResult ? (isCorrect ? 'success' : 'danger') : 'default'}
      className={className}
    >
      {/* Question */}
      <div className="flex items-start gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-warning shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-lg mb-1">🧠 Security Challenge</h3>
          <p className="text-muted-foreground">{question}</p>
        </div>
      </div>

      {/* Code Block */}
      <div className="bg-background/50 rounded-lg p-4 mb-6 font-mono text-sm overflow-x-auto border border-border">
        {codeLines.map((line, i) => (
          <div 
            key={i}
            className={cn(
              "flex items-center gap-2 px-2 py-0.5 rounded transition-colors",
              showResult && i + 1 === correctLine && "bg-success/20 border-l-2 border-success",
              showResult && selectedLine === i + 1 && !isCorrect && "bg-destructive/20 border-l-2 border-destructive"
            )}
          >
            <span className="text-muted-foreground/50 w-6 text-right select-none">{i + 1}</span>
            <code className="flex-1">{line}</code>
          </div>
        ))}
      </div>

      {/* Options */}
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2 mb-6"
          >
            {options.map((option) => (
              <motion.button
                key={option.line}
                onClick={() => setSelectedLine(option.line)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg border transition-all",
                  selectedLine === option.line
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 hover:border-muted-foreground/50"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="font-mono text-sm">{option.text}</span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mb-6"
          >
            {/* Result Banner */}
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg",
              isCorrect 
                ? "bg-success/20 border border-success/30 text-success" 
                : "bg-destructive/20 border border-destructive/30 text-destructive"
            )}>
              {isCorrect ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <div className="font-bold">Correct! 🎉</div>
                    <div className="text-sm opacity-80">You identified the vulnerability!</div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6" />
                  <div>
                    <div className="font-bold">Not quite! 🤔</div>
                    <div className="text-sm opacity-80">
                      The vulnerable line is {correctLine}. Let's understand why...
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Explanation */}
            <div className="flex items-start gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
              <Lightbulb className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-bold text-warning mb-1">📚 Explanation</div>
                <p className="text-foreground/80">{explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Attempts: {attempts}
        </div>
        <div className="flex gap-2">
          {showResult && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          )}
          {!showResult && (
            <button
              onClick={handleSubmit}
              disabled={selectedLine === null}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-lg font-mono transition-colors",
                selectedLine !== null
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </TerminalWindow>
  );
};

export default Quiz;
