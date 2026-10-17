"use client";

import React, { useState, useEffect } from "react";
import RobotLogo from "../RobotLogo";
import { Mic, X, Volume2, Globe } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen8VoiceAssistant({ onNavigate, isLightMode }: ScreenProps) {
  const [selectedLang, setSelectedLang] = useState<"en" | "gu" | "hi">("gu");
  const [heardText, setHeardText] = useState("મમ્મીને ફોન કરો...");

  useEffect(() => {
    // Automatically transition to Screen 9 (Chat response) after 3.5s of simulated listening
    const timer = setTimeout(() => {
      onNavigate(9);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RobotLogo size={28} glow={false} />
          <span className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            ROBO
          </span>
        </div>
        <button
          onClick={() => onNavigate(7)}
          className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Listening Visualization */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-slate-100 tracking-wide mb-8">
          Listening...
        </h3>

        {/* Concentric Pulsing Audio Waves */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute w-64 h-64 rounded-full border border-cyan-500/20 animate-ping opacity-25" />
          <div className="absolute w-52 h-52 rounded-full border border-blue-500/30 animate-pulse opacity-40" />
          <div className="absolute w-40 h-40 rounded-full border-2 border-cyan-400/40 animate-pulse" />

          {/* Central Listening Circle with Mic */}
          <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-blue-700 via-cyan-500 to-sky-400 text-white flex items-center justify-center shadow-2xl shadow-cyan-500/40">
            <Mic size={48} className="animate-pulse" />
          </div>
        </div>

        <p className="text-base font-semibold text-cyan-300 mt-8">Speak now...</p>

        {/* Real-time Transcription Preview */}
        <div className="mt-4 px-4 py-2.5 rounded-2xl bg-[#10192E] border border-cyan-500/30 max-w-xs text-sm font-medium text-slate-200">
          "{heardText}"
        </div>

        {/* Multilingual Selector Pill */}
        <div className="mt-6 inline-flex items-center p-1 rounded-full bg-[#10192E] border border-[#1D2B4A] text-xs">
          <button
            onClick={() => {
              setSelectedLang("en");
              setHeardText("Call Mom on my phone...");
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              selectedLang === "en" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
            }`}
          >
            English
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => {
              setSelectedLang("gu");
              setHeardText("મમ્મીને ફોન કરો...");
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              selectedLang === "gu" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
            }`}
          >
            ગુજરાતી
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => {
              setSelectedLang("hi");
              setHeardText("मम्मी को फोन करो...");
            }}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              selectedLang === "hi" ? "bg-cyan-500 text-slate-950" : "text-slate-400"
            }`}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* Cancel Button */}
      <button
        onClick={() => onNavigate(7)}
        className="w-full py-3 rounded-2xl border border-slate-700 text-slate-300 font-semibold text-sm hover:bg-slate-800/80 active:scale-95 transition-all"
      >
        Cancel
      </button>
    </div>
  );
}
