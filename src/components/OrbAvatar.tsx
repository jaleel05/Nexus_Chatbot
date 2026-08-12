import React from 'react';

interface OrbAvatarProps {
  isGenerating?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const OrbAvatar: React.FC<OrbAvatarProps> = ({
  isGenerating = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
  };

  const coreSize = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size]} ${className}`}
      style={{ perspective: '800px' }}
      aria-label={isGenerating ? 'AI Thinking Orb Active' : 'AI Assistant Avatar'}
    >
      {/* Reduced motion media query target wrapper */}
      <div className="relative w-full h-full flex items-center justify-center transform-gpu">
        
        {/* Outer Pulsing Glow Aura */}
        <div
          className={`absolute inset-0 rounded-full blur-md transition-all duration-500 ${
            isGenerating
              ? 'bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 opacity-80 scale-125 animate-pulse'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 opacity-40 scale-100 group-hover:opacity-70'
          }`}
        />

        {/* 3D Rotating Ring 1 */}
        <div
          className={`absolute inset-0 rounded-full border border-violet-400/40 transform-gpu transition-all duration-700 ${
            isGenerating
              ? 'animate-[spin_2.5s_linear_infinite] border-fuchsia-400/70 shadow-[0_0_15px_rgba(217,70,239,0.5)]'
              : 'animate-[spin_8s_linear_infinite]'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isGenerating
              ? 'rotateX(65deg) rotateY(20deg)'
              : 'rotateX(60deg) rotateY(15deg)',
          }}
        />

        {/* 3D Rotating Ring 2 (Counter direction) */}
        <div
          className={`absolute inset-0.5 rounded-full border border-indigo-400/30 transform-gpu transition-all duration-700 ${
            isGenerating
              ? 'animate-[spin_1.8s_linear_infinite_reverse] border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
              : 'animate-[spin_12s_linear_infinite_reverse]'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(30deg) rotateY(-45deg)',
          }}
        />

        {/* Central 3D Sphere Core */}
        <div
          className={`relative rounded-full shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 ${coreSize[size]} ${
            isGenerating
              ? 'bg-gradient-to-br from-fuchsia-400 via-violet-600 to-indigo-900 shadow-[0_0_20px_rgba(168,85,247,0.8)] scale-105'
              : 'bg-gradient-to-br from-violet-400 via-indigo-600 to-slate-950 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
          }`}
        >
          {/* Internal Specular Highlight / Lens Reflection */}
          <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-white/40 rounded-full blur-[1px] transform -rotate-45" />

          {/* Core Eye / Gem Glow */}
          <div
            className={`rounded-full transition-all duration-300 ${
              size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            } ${
              isGenerating
                ? 'bg-cyan-200 shadow-[0_0_12px_#38bdf8] animate-ping'
                : 'bg-indigo-100 shadow-[0_0_6px_#818cf8]'
            }`}
          />

          {/* Floating Orbiting Photons during active generation */}
          {isGenerating && (
            <div className="absolute inset-0 animate-spin transition-opacity duration-300">
              <div className="absolute top-0.5 left-1/2 w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_#22d3ee]" />
              <div className="absolute bottom-0.5 right-1/2 w-1 h-1 bg-fuchsia-300 rounded-full shadow-[0_0_6px_#f0abfc]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
