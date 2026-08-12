import React from 'react';
import { ArrowDown } from 'lucide-react';

interface JumpToBottomButtonProps {
  onClick: () => void;
  visible: boolean;
  hasNewTokens?: boolean;
}

export const JumpToBottomButton: React.FC<JumpToBottomButtonProps> = ({
  onClick,
  visible,
  hasNewTokens = false,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 animate-[fadeIn_0.2s_ease-out]">
      <button
        onClick={onClick}
        aria-label="Jump to latest message"
        className="px-4 py-2 bg-zinc-800/80 backdrop-blur-md border border-white/10 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-zinc-700 text-gray-200 transition-all shadow-xl cursor-pointer active:scale-95"
      >
        <ArrowDown className="w-3.5 h-3.5 text-violet-400" />
        <span>Jump to latest</span>
        {hasNewTokens && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};
