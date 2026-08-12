import React from 'react';
import { OrbAvatar } from './OrbAvatar';
import { MarkdownRenderer } from './MarkdownRenderer';
import { User } from 'lucide-react';

interface ChatMessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
  isThinking?: boolean;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  role,
  content,
  isStreaming = false,
  isThinking = false,
}) => {
  const isUser = role === 'user';

  if (role === 'system') return null;

  return (
    <div
      className={`group flex items-start gap-3 my-4 w-full transition-all duration-300 animate-[fadeInUp_0.3s_ease-out] ${
        isUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'
      }`}
    >
      {/* Avatar Icon */}
      <div className="flex-shrink-0 mt-1">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 border border-white/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-md">
            <OrbAvatar isGenerating={isStreaming || isThinking} size="sm" />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div
        className={`relative max-w-[85%] md:max-w-[80%] px-5 py-3 transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-violet-600 to-indigo-700 text-white rounded-2xl rounded-tr-none shadow-xl border border-white/10'
            : 'bg-white/5 backdrop-blur-md border border-white/10 text-slate-100 rounded-2xl rounded-tl-none shadow-lg'
        }`}
      >
        {/* Soft Ambient Inner Glow for Assistant */}
        {!isUser && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none bg-gradient-to-b from-white/5 to-transparent opacity-50" />
        )}

        {/* User Content */}
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed break-words font-normal">
            {content}
          </p>
        ) : (
          /* Assistant Content + Smooth Thinking Indicator Handoff */
          <div className="relative">
            {/* Thinking / Waiting for first token indicator */}
            {isThinking && !content ? (
              <div className="flex items-center gap-2 py-1.5 px-1 text-violet-300 text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-500"></span>
                </span>
                <span className="animate-pulse">Thinking & processing response...</span>
                <div className="flex gap-1 items-center ml-1">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-[bounce_1s_infinite_100ms]" />
                  <span className="w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-[bounce_1s_infinite_300ms]" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_500ms]" />
                </div>
              </div>
            ) : (
              /* Rendered Markdown Stream with smooth handoff */
              <div className="relative">
                <MarkdownRenderer content={content} isStreaming={isStreaming} />
                
                {/* Streaming Blinking Caret / Pulsing End Dot */}
                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-violet-400 rounded-xs animate-pulse align-middle shadow-[0_0_8px_#a855f7]" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
