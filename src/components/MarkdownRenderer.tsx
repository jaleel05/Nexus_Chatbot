import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isStreaming?: boolean;
}

/**
 * Repairs dangling or unclosed markdown syntax (code fences, bold, backticks)
 * that occur midway through a token stream.
 */
function repairPartialMarkdown(text: string): string {
  if (!text) return '';

  let repaired = text;

  // 1. Repair unclosed code fences ```
  const fenceMatches = repaired.match(/```/g);
  if (fenceMatches && fenceMatches.length % 2 !== 0) {
    repaired += '\n```';
  }

  // 2. Repair unclosed inline backticks `
  // Filter out backticks that are part of ``` fences
  const textWithoutFences = repaired.replace(/```[\s\S]*?```/g, '').replace(/```.*/g, '');
  const inlineTicks = textWithoutFences.match(/`/g);
  if (inlineTicks && inlineTicks.length % 2 !== 0) {
    repaired += '`';
  }

  // 3. Repair unclosed bold **
  const doubleAsterisks = textWithoutFences.match(/\*\*/g);
  if (doubleAsterisks && doubleAsterisks.length % 2 !== 0) {
    repaired += '**';
  }

  return repaired;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  isStreaming = false,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const displayContent = isStreaming ? repairPartialMarkdown(content) : content;

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="prose prose-invert max-w-none text-slate-200 text-sm md:text-base leading-relaxed break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            const isInline = !match && !String(children).includes('\n');

            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-white/10 text-violet-300 font-mono text-xs md:text-sm border border-white/10"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-3 rounded-xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-lg group">
                <div className="flex items-center justify-between px-4 py-1.5 bg-white/5 border-b border-white/10 text-xs text-slate-400 font-mono">
                  <span>{match ? match[1] : 'code'}</span>
                  <button
                    onClick={() => handleCopyCode(codeString)}
                    className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy code"
                  >
                    {copiedCode === codeString ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-slate-200 leading-normal">
                  <code>{children}</code>
                </pre>
              </div>
            );
          },
          p({ children }) {
            return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>;
          },
          li({ children }) {
            return <li className="leading-relaxed">{children}</li>;
          },
          h1({ children }) {
            return <h1 className="text-xl md:text-2xl font-bold text-white mb-3 mt-4 border-b border-white/10 pb-1">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="text-lg md:text-xl font-semibold text-white mb-2 mt-3">{children}</h2>;
          },
          h3({ children }) {
            return <h3 className="text-base md:text-lg font-medium text-violet-300 mb-2 mt-2">{children}</h3>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-violet-500/60 pl-4 py-1 my-3 bg-violet-500/5 rounded-r-lg italic text-slate-300">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
                <table className="w-full text-left border-collapse text-xs md:text-sm">{children}</table>
              </div>
            );
          },
          th({ children }) {
            return <th className="bg-white/10 p-2.5 font-semibold text-slate-200 border-b border-white/10">{children}</th>;
          },
          td({ children }) {
            return <td className="p-2.5 border-b border-white/5 text-slate-300">{children}</td>;
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 underline hover:text-violet-300 transition-colors"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
};
