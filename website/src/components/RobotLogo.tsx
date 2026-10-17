"use client";

import React from "react";

interface RobotLogoProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export default function RobotLogo({ className = "", size = 64, glow = true }: RobotLogoProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-xl opacity-60 bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse pointer-events-none"
          style={{ transform: "scale(1.2)" }}
        />
      )}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_8px_16px_rgba(0,180,255,0.35)]"
      >
        <defs>
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2F1FF" />
            <stop offset="60%" stopColor="#9BC7F5" />
            <stop offset="100%" stopColor="#5D92D6" />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1528" />
            <stop offset="100%" stopColor="#050B17" />
          </linearGradient>
          <linearGradient id="cyanEyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Outer Ears */}
        <rect x="14" y="50" width="10" height="24" rx="5" fill="url(#earGrad)" />
        <rect x="96" y="50" width="10" height="24" rx="5" fill="url(#earGrad)" />
        <circle cx="19" cy="62" r="2.5" fill="#E0F2FE" />
        <circle cx="101" cy="62" r="2.5" fill="#E0F2FE" />

        {/* Head Base */}
        <rect x="22" y="24" width="76" height="68" rx="28" fill="url(#bodyGrad)" stroke="#A5C9EB" strokeWidth="1.5" />

        {/* Dark Visor Screen */}
        <rect x="28" y="32" width="64" height="46" rx="18" fill="url(#screenGrad)" stroke="#1E3A5F" strokeWidth="1.5" />

        {/* Glowing Eyes */}
        <ellipse cx="44" cy="52" rx="9" ry="12" fill="url(#cyanEyeGrad)" className="animate-pulse" />
        <ellipse cx="76" cy="52" rx="9" ry="12" fill="url(#cyanEyeGrad)" className="animate-pulse" />
        <circle cx="47" cy="48" r="3.5" fill="#FFFFFF" />
        <circle cx="79" cy="48" r="3.5" fill="#FFFFFF" />

        {/* Gentle Happy Mouth Arc */}
        <path d="M53 66 Q60 70 67 66" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

        {/* Antenna */}
        <path d="M60 24 V12" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="10" r="5" fill="#00D2FF" />
        <circle cx="60" cy="10" r="2" fill="#FFFFFF" />

        {/* Neck Accent */}
        <rect x="42" y="93" width="36" height="8" rx="4" fill="#0284C7" />
        <circle cx="60" cy="97" r="2" fill="#38BDF8" />
      </svg>
    </div>
  );
}
