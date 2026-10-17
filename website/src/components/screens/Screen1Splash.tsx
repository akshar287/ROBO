"use client";

import React, { useEffect, useState } from "react";
import RobotLogo from "../RobotLogo";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen1Splash({ onNavigate, isLightMode }: ScreenProps) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Checking system integrity...");

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText("Connecting AI brain services...");
    }, 800);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText("Syncing device permissions...");
    }, 1600);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText("Ready!");
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col items-center justify-between p-8 text-center transition-colors duration-300 ${
        isLightMode
          ? "bg-gradient-to-b from-slate-50 via-sky-50 to-blue-100 text-slate-800"
          : "bg-gradient-to-b from-[#060a14] via-[#091124] to-[#0d1b3a] text-white"
      }`}
    >
      <div className="w-full flex justify-end">
        <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          v1.0.0
        </span>
      </div>

      <div className="flex flex-col items-center my-auto">
        <div className="relative mb-6">
          <RobotLogo size={140} glow={!isLightMode} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 drop-shadow-sm">
          ROBO
        </h1>

        <p className="mt-2 text-sm md:text-base font-medium tracking-wide text-cyan-300/80">
          Your Personal AI Agent
        </p>

        <p className="mt-6 text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <span>Talk</span>
          <span className="text-cyan-500">•</span>
          <span>Ask</span>
          <span className="text-cyan-500">•</span>
          <span>Get Things Done</span>
        </p>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800/60 rounded-full overflow-hidden border border-slate-700/40">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 animate-pulse">{statusText}</p>

        <button
          onClick={() => onNavigate(2)}
          className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all"
        >
          {progress === 100 ? "Enter ROBO →" : "Get Started"}
        </button>
      </div>
    </div>
  );
}
