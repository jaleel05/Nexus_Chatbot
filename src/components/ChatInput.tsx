import React, { useRef, useEffect, useState } from 'react';
import { Send, Square, ArrowUp } from 'lucide-react';
import { WalkingRobot } from './WalkingRobot';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isGenerating: boolean;
  onStop: () => void;
  disabled?: boolean;
  isRobotVisible?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  isGenerating,
  onStop,
  disabled = false,
  isRobotVisible = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating) {
        onStop();
      } else if (input.trim()) {
        const form = e.currentTarget.form;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative w-full max-w-4xl mx-auto pt-2 sm:pt-4"
    >
      <div className="relative flex items-end gap-3 sm:gap-4">
        {/* Animated Walking Robot on Search/Input Bar */}
        <WalkingRobot
          input={input}
          isGenerating={isGenerating}
          isFocused={isFocused}
          isVisible={isRobotVisible}
        />

        {/* Textarea Input Container */}
        <div className="relative group flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isGenerating ? "AI is replying... Press STOP or type next prompt" : "Ask Aether anything..."}
            rows={1}
            disabled={disabled}
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none transition-all placeholder:text-zinc-600 text-slate-100 text-sm md:text-base leading-relaxed min-h-[52px] sm:min-h-[58px] max-h-[160px]"
          />
        </div>

        {/* Send / Stop Action Button */}
        <div className="flex-shrink-0">
          {isGenerating ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generation"
              className="h-[52px] sm:h-[58px] px-5 sm:px-8 bg-red-500/20 text-red-400 border border-red-500/50 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-red-500/30 active:scale-95 transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              aria-label="Send message"
              className={`h-[52px] sm:h-[58px] px-5 sm:px-8 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                input.trim() && !disabled
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border border-white/20 hover:from-violet-500 hover:to-indigo-500 active:scale-95 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">SEND</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer System Metrics Line */}
      <div className="mt-3 flex justify-between text-[10px] text-zinc-500 font-mono">
        <span>LATENCY: 42MS</span>
        <span>STREAM: READY</span>
        <span>SESSION: AE-992-X</span>
      </div>
    </form>
  );
};
