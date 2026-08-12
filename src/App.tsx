import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useChat, UIMessage } from '@ai-sdk/react';
import { OrbAvatar } from './components/OrbAvatar';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { ChatInput } from './components/ChatInput';
import { JumpToBottomButton } from './components/JumpToBottomButton';
import Orb from './components/Orb';
import { Sparkles, Trash2, Cpu, Zap, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * Safely extracts text content from a UIMessage (v5 parts or legacy string content).
 */
function getMessageText(msg: UIMessage | { role: string; content?: string; parts?: Array<unknown> }): string {
  if ('content' in msg && typeof msg.content === 'string' && msg.content) {
    return msg.content;
  }
  if ('parts' in msg && Array.isArray(msg.parts)) {
    return msg.parts
      .map((part) => {
        if (typeof part === 'object' && part !== null && 'type' in part && (part as { type: string }).type === 'text' && 'text' in part) {
          return String((part as { text: unknown }).text || '');
        }
        return '';
      })
      .join('');
  }
  return '';
}

export default function App() {
  const {
    messages,
    sendMessage,
    stop,
    status,
    error,
    clearError,
    setMessages,
  } = useChat();

  const [input, setInput] = useState<string>('');

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef<boolean>(true);
  const [isUserAtBottom, setIsUserAtBottom] = useState<boolean>(true);
  const [hasNewUnseenTokens, setHasNewUnseenTokens] = useState<boolean>(false);

  // Active generation or thinking states
  const isGenerating = status === 'streaming' || status === 'submitted';

  // Check if assistant is waiting for first token ("Thinking")
  const lastMessage = messages[messages.length - 1];
  const lastMessageText = lastMessage ? getMessageText(lastMessage) : '';
  const isThinking =
    isGenerating &&
    (!lastMessage || lastMessage.role !== 'assistant' || !lastMessageText);

  const [isScrollingDown, setIsScrollingDown] = useState<boolean>(true);
  const lastScrollTopRef = useRef<number>(0);

  /**
   * Auto-scroll Pinning Logic:
   * Tracks user scroll offset. If within 60px of bottom, pin remains active.
   * If user scrolls up, pin is released. Also tracks scroll direction.
   */
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const currentScrollTop = container.scrollTop;
    if (currentScrollTop > lastScrollTopRef.current + 5) {
      setIsScrollingDown(true);
    } else if (currentScrollTop < lastScrollTopRef.current - 5) {
      setIsScrollingDown(false);
    }
    lastScrollTopRef.current = currentScrollTop;

    const threshold = 60;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const isBottom = distanceFromBottom <= threshold;

    isAtBottomRef.current = isBottom;
    setIsUserAtBottom(isBottom);

    if (isBottom) {
      setHasNewUnseenTokens(false);
      setIsScrollingDown(true);
    }
  }, []);

  // Auto-scroll when new tokens arrive ONLY IF pinned at bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    if (isAtBottomRef.current) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    } else if (isGenerating) {
      setHasNewUnseenTokens(true);
    }
  }, [messages, isGenerating]);

  // Jump to latest message handler
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
      isAtBottomRef.current = true;
      setIsUserAtBottom(true);
      setHasNewUnseenTokens(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userText = input.trim();
    setInput('');
    if (error) clearError();

    // Auto-scroll to bottom on send
    isAtBottomRef.current = true;
    setIsUserAtBottom(true);

    sendMessage({ text: userText });
  };

  // Starter Prompts
  const starterPrompts = [
    {
      title: 'Explain Quantum Computing',
      prompt: 'Explain quantum computing in simple terms with a real-world analogy.',
      icon: <Cpu className="w-4 h-4 text-violet-400" />,
    },
    {
      title: 'Next.js App Router API',
      prompt: 'Show me how to create a Next.js App Router route handler with streaming SSE.',
      icon: <Zap className="w-4 h-4 text-fuchsia-400" />,
    },
    {
      title: 'Creative Storytelling',
      prompt: 'Write a short atmospheric sci-fi story about a sentient space station.',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
    },
  ];

  const handleSelectStarter = (promptText: string) => {
    setInput(promptText);
  };

  const handleClearChat = () => {
    setMessages([]);
    if (error) clearError();
  };

  const handleRetry = () => {
    if (error) clearError();
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      const text = getMessageText(lastUserMsg);
      if (text) {
        sendMessage({ text });
      }
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full bg-[#050508] text-gray-100 font-sans overflow-hidden selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Background Interactive WebGL Orb */}
      <div className="absolute inset-0 w-full h-full pointer-events-auto opacity-80 z-0">
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
          backgroundColor="#050508"
        />
      </div>

      {/* Glassmorphic Header */}
      <header className="relative z-20 flex items-center justify-between px-4 sm:px-8 h-16 bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 p-[1px] shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full bg-slate-950/90 rounded-[11px] flex items-center justify-center">
              <span className="font-black text-sm bg-gradient-to-br from-white via-violet-200 to-cyan-300 bg-clip-text text-transparent">N</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              NEXUS
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold font-mono tracking-widest uppercase rounded-md bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 text-cyan-300 border border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              AI
            </span>
          </div>
        </div>

        {/* Connection & Model Indicators */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping' : 'bg-green-500 shadow-[0_0_8px_#22c55e]'}`} />
            <span className="hidden sm:inline">{isGenerating ? 'Streaming...' : 'OpenRouter Connected'}</span>
          </div>

          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition-all duration-200 cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </header>

      {/* Messages Scroll View */}
      <main
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto min-h-full flex flex-col justify-between">
          
          {/* Welcome Screen when conversation is empty */}
          {messages.length === 0 ? (
            <div className="my-auto py-12 flex flex-col items-center text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="mb-6 relative">
                <OrbAvatar isGenerating={false} size="lg" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-violet-300 mb-3 tracking-tight">
                What shall we create today?
              </h2>
              <p className="max-w-md text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
                A production-grade streaming AI chatbot using Vercel AI SDK and OpenRouter / Gemini models.
              </p>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
                {starterPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectStarter(item.prompt)}
                    className="group p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-violet-500/50 hover:bg-white/10 text-left transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
                  >
                    <div className="p-2 w-fit rounded-xl bg-white/5 border border-white/10 mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200 group-hover:text-violet-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Conversation Message List */
            <div className="flex-1 space-y-4 pb-12">
              {messages.map((msg) => {
                const textContent = getMessageText(msg);
                return (
                  <ChatMessageBubble
                    key={msg.id}
                    role={msg.role as 'user' | 'assistant' | 'system'}
                    content={textContent}
                    isStreaming={
                      isGenerating &&
                      msg.id === lastMessage?.id &&
                      msg.role === 'assistant'
                    }
                  />
                );
              })}

              {/* Thinking Indicator before first token arrives */}
              {isThinking && (
                <ChatMessageBubble
                  role="assistant"
                  content=""
                  isThinking={true}
                />
              )}

              {/* Error Banner with Retry */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-3 text-sm animate-[fadeIn_0.3s_ease-out]">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    <span>Failed to complete stream response.</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Jump to Bottom Button when user unpins scroll */}
      <JumpToBottomButton
        onClick={scrollToBottom}
        visible={!isUserAtBottom && messages.length > 0}
        hasNewTokens={hasNewUnseenTokens}
      />

      {/* Input Footer Panel */}
      <footer className="relative z-20 w-full bg-white/5 backdrop-blur-xl border-t border-white/10 p-4 sm:p-6">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isGenerating={isGenerating}
          onStop={stop}
          isRobotVisible={isUserAtBottom || isScrollingDown || messages.length === 0}
        />
      </footer>
    </div>
  );
}
