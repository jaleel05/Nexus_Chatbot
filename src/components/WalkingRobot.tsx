import React, { useState, useEffect } from 'react';

interface WalkingRobotProps {
  input: string;
  isGenerating: boolean;
  isFocused: boolean;
  isVisible?: boolean;
}

export const WalkingRobot: React.FC<WalkingRobotProps> = ({
  input,
  isGenerating,
  isFocused,
  isVisible = true,
}) => {
  // Walking position percentage (0 to 80%)
  const [posX, setPosX] = useState<number>(20);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');

  const hasContent = input.trim().length > 0;
  const isActiveTyping = isFocused || hasContent;

  // Track typing changes for animation reaction
  useEffect(() => {
    if (hasContent) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 800);

      // Select cute reaction text based on input length
      const len = input.trim().length;
      if (len < 10) {
        setSpeechBubbleText("Ooh, I see you typing! ✨");
      } else if (len < 30) {
        setSpeechBubbleText("Watching you create... 🤖");
      } else if (len < 70) {
        setSpeechBubbleText("This idea is getting good! 💡");
      } else {
        setSpeechBubbleText("Ready to process this request! 🚀");
      }

      return () => clearTimeout(timer);
    } else if (isFocused) {
      setSpeechBubbleText("What shall we build today? 🤔");
    } else {
      setSpeechBubbleText("");
    }
  }, [input, hasContent, isFocused]);

  // Patrol walking loop when idle (not active typing and not generating)
  useEffect(() => {
    if (isActiveTyping || isGenerating) return;

    const interval = setInterval(() => {
      setPosX((prev) => {
        const step = 0.4;
        if (direction === 'right') {
          if (prev >= 78) {
            setDirection('left');
            return prev - step;
          }
          return prev + step;
        } else {
          if (prev <= 8) {
            setDirection('right');
            return prev + step;
          }
          return prev - step;
        }
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isActiveTyping, isGenerating, direction]);

  const baseFlip = isActiveTyping
    ? 'translateX(-50%)'
    : direction === 'left'
    ? 'scaleX(-1)'
    : 'scaleX(1)';

  const visibilityState = isVisible
    ? 'translateY(0px) scale(1)'
    : 'translateY(16px) scale(0.85)';

  return (
    <div
      className={`absolute -top-11 sm:-top-13 z-30 pointer-events-none select-none transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        left: isActiveTyping ? '50%' : `${posX}%`,
        transform: `${baseFlip} ${visibilityState}`,
      }}
    >
      {/* Speech Bubble when typing/focused or generating */}
      {(speechBubbleText || isGenerating) && (
        <div
          className={`absolute -top-11 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-slate-900/90 border border-violet-400/40 text-violet-200 text-[11px] font-medium shadow-[0_0_15px_rgba(139,92,246,0.3)] backdrop-blur-md animate-[bounce_2s_infinite] flex items-center gap-1.5 ${
            direction === 'left' && !isActiveTyping ? 'scale-x-[-1]' : ''
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>{isGenerating ? "Processing your creation! ✨" : speechBubbleText}</span>
          {/* Arrow pointing down */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 border-r border-b border-violet-400/40 rotate-45" />
        </div>
      )}

      {/* Robot Character Container */}
      <div
        className={`relative w-12 h-14 sm:w-14 sm:h-16 flex flex-col items-center justify-center ${
          !isActiveTyping && !isGenerating ? 'animate-[walkBob_0.5s_infinite_alternate]' : ''
        } ${isGenerating ? 'animate-bounce' : ''}`}
      >
        {/* Glow halo behind robot */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md -z-10 animate-pulse" />

        {/* SVG Robot Graphic matching uploaded image */}
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-[0_4px_10px_rgba(0,240,255,0.3)]"
        >
          <defs>
            {/* White Body Gradient */}
            <linearGradient id="whiteBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Dark Visor Screen */}
            <linearGradient id="visorBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>

            {/* Cyan Eye Glow */}
            <radialGradient id="cyanEyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </radialGradient>

            <filter id="eyeGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Antennas / Ears */}
          <rect x="14" y="22" width="6" height="12" rx="3" fill="url(#whiteBody)" />
          <circle cx="17" cy="20" r="3" fill="#00f0ff" className="animate-pulse" />
          <rect x="80" y="22" width="6" height="12" rx="3" fill="url(#whiteBody)" />
          <circle cx="83" cy="20" r="3" fill="#00f0ff" className="animate-pulse" />

          {/* Head Outer White Helmet */}
          <rect x="20" y="10" width="60" height="48" rx="20" fill="url(#whiteBody)" stroke="#94a3b8" strokeWidth="1" />
          
          {/* Top Helmet Gloss Highlight */}
          <path d="M 30 14 Q 50 12 70 14 Q 50 18 30 14" fill="#ffffff" opacity="0.8" />

          {/* Dark Visor Screen */}
          <rect x="26" y="18" width="48" height="32" rx="12" fill="url(#visorBg)" stroke="#334155" strokeWidth="1" />

          {/* Glowing Cyan Eyes */}
          {isActiveTyping ? (
            /* Watching / Curious Happy Eyes when typing */
            <g filter="url(#eyeGlowFilter)">
              {/* Left Eye - Happy Curve or Attentive Oval */}
              <ellipse cx="40" cy="32" rx="7" ry="8" fill="url(#cyanEyeGlow)" />
              <circle cx="42" cy="30" r="2.5" fill="#ffffff" />
              
              {/* Right Eye */}
              <ellipse cx="60" cy="32" rx="7" ry="8" fill="url(#cyanEyeGlow)" />
              <circle cx="62" cy="30" r="2.5" fill="#ffffff" />

              {/* Cute Happy Mouth Line */}
              <path d="M 46 42 Q 50 45 54 42" fill="none" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : isGenerating ? (
            /* Energetic Star Eyes when AI is generating */
            <g filter="url(#eyeGlowFilter)">
              <circle cx="40" cy="32" r="8" fill="url(#cyanEyeGlow)" className="animate-ping" />
              <circle cx="60" cy="32" r="8" fill="url(#cyanEyeGlow)" className="animate-ping" />
              <path d="M 44 42 Q 50 38 56 42" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ) : (
            /* Standard Idle Eyes */
            <g filter="url(#eyeGlowFilter)">
              <ellipse cx="40" cy="32" rx="6" ry="7" fill="url(#cyanEyeGlow)" />
              <circle cx="42" cy="30" r="2" fill="#ffffff" />

              <ellipse cx="60" cy="32" rx="6" ry="7" fill="url(#cyanEyeGlow)" />
              <circle cx="62" cy="30" r="2" fill="#ffffff" />

              <line x1="47" y1="42" x2="53" y2="42" stroke="#00f0ff" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* Neck Joint */}
          <rect x="44" y="58" width="12" height="6" rx="2" fill="#64748b" />

          {/* Torso Body */}
          <rect x="30" y="64" width="40" height="32" rx="10" fill="url(#whiteBody)" stroke="#94a3b8" strokeWidth="1" />

          {/* Chest Gem / Glowing Core */}
          <circle cx="50" cy="76" r="5" fill="#00f0ff" className="animate-pulse" filter="url(#eyeGlowFilter)" />
          <circle cx="50" cy="76" r="2" fill="#ffffff" />

          {/* Arms */}
          {/* Left Arm */}
          <g className={!isActiveTyping ? 'animate-[armSwingLeft_0.5s_infinite_alternate]' : 'animate-[typeWave_1s_infinite]'}>
            <rect x="18" y="66" width="10" height="20" rx="5" fill="url(#whiteBody)" />
            <circle cx="23" cy="88" r="3" fill="#cbd5e1" />
          </g>

          {/* Right Arm */}
          <g className={!isActiveTyping ? 'animate-[armSwingRight_0.5s_infinite_alternate]' : ''}>
            <rect x="72" y="66" width="10" height="20" rx="5" fill="url(#whiteBody)" />
            <circle cx="77" cy="88" r="3" fill="#cbd5e1" />
          </g>

          {/* Legs */}
          {/* Left Leg */}
          <g className={!isActiveTyping ? 'animate-[legStepLeft_0.5s_infinite_alternate]' : ''}>
            <rect x="36" y="96" width="10" height="16" rx="4" fill="url(#whiteBody)" />
            <ellipse cx="40" cy="114" rx="7" ry="4" fill="#64748b" />
          </g>

          {/* Right Leg */}
          <g className={!isActiveTyping ? 'animate-[legStepRight_0.5s_infinite_alternate]' : ''}>
            <rect x="54" y="96" width="10" height="16" rx="4" fill="url(#whiteBody)" />
            <ellipse cx="58" cy="114" rx="7" ry="4" fill="#64748b" />
          </g>
        </svg>

        {/* Small Shadow beneath feet */}
        <div className="w-8 h-1.5 bg-black/40 rounded-full blur-[2px] mt-0.5" />
      </div>
    </div>
  );
};
