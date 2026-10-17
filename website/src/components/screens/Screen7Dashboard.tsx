"use client";

import React, { useState } from "react";
import RobotLogo from "../RobotLogo";
import {
  Mic,
  Smartphone,
  Laptop,
  CheckCircle2,
  Home,
  CheckSquare,
  History,
  Settings,
  ChevronRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen7Dashboard({ onNavigate, isLightMode }: ScreenProps) {
  const [isAgentOn, setIsAgentOn] = useState(true);

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RobotLogo size={32} glow={false} />
          <span className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
            ROBO
          </span>
        </div>

        {/* Master Agent ON/OFF Pill */}
        <button
          onClick={() => setIsAgentOn(!isAgentOn)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
            isAgentOn
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
              : "bg-red-500/15 border-red-500/40 text-red-400"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isAgentOn ? "bg-emerald-400 animate-pulse" : "bg-red-400"
            }`}
          />
          <span>{isAgentOn ? "Agent ON" : "Agent OFF"}</span>
          <div
            className={`w-7 h-4 rounded-full p-0.5 transition-colors ${
              isAgentOn ? "bg-emerald-500" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                isAgentOn ? "translate-x-3" : "translate-x-0"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Greeting */}
      <div className="mt-4 text-left">
        <h2 className="text-xl font-black text-slate-100 flex items-center gap-1.5">
          <span>Good Morning, Akshar</span>
          <span className="text-yellow-400">👋</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">How can I help you today?</p>
      </div>

      {/* Center Voice Orb */}
      <div className="my-auto flex flex-col items-center justify-center py-6">
        <div className="relative flex items-center justify-center">
          {/* Animated Waveform Soundwaves around the button */}
          <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-36 h-36 rounded-full border border-blue-500/30 animate-pulse opacity-40 pointer-events-none" />

          {/* Big Voice Button */}
          <button
            onClick={() => onNavigate(8)} // Screen 8: Voice Assistant
            className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-500 to-sky-400 text-white flex items-center justify-center shadow-xl shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all group"
          >
            <Mic size={44} className="group-hover:animate-bounce" />
          </button>
        </div>

        <button
          onClick={() => onNavigate(9)} // Screen 9: Chat
          className="mt-6 flex items-center gap-2 text-xs font-medium text-slate-300 bg-[#10192E] border border-[#1D2B4A] hover:border-cyan-500/40 px-4 py-2 rounded-full shadow-sm hover:text-cyan-400 transition-all"
        >
          <span>Tap to speak or type a message...</span>
          <ChevronRight size={14} className="text-cyan-400" />
        </button>
      </div>

      {/* Connected Devices & Agent Status Pills */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          onClick={() => onNavigate(6)}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } hover:border-emerald-500/40`}
        >
          <div className="flex items-center gap-1 text-emerald-400">
            <Smartphone size={14} />
            <span className="text-[11px] font-bold">Phone</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Connected</span>
        </button>

        <button
          onClick={() => onNavigate(14)}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } hover:border-cyan-500/40`}
        >
          <div className="flex items-center gap-1 text-cyan-400">
            <Laptop size={14} />
            <span className="text-[11px] font-bold">Laptop</span>
          </div>
          <span className="text-[10px] text-cyan-400 font-semibold">Connected</span>
        </button>

        <button
          onClick={() => setIsAgentOn(!isAgentOn)}
          className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } hover:border-emerald-500/40`}
        >
          <div className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 size={14} />
            <span className="text-[11px] font-bold">Agent</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div
        className={`flex items-center justify-around py-2.5 px-3 rounded-2xl border ${
          isLightMode ? "bg-white border-slate-200" : "bg-[#0B1327] border-[#172442]"
        }`}
      >
        <button className="flex flex-col items-center gap-1 text-cyan-400">
          <Home size={18} />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button
          onClick={() => onNavigate(17)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <CheckSquare size={18} />
          <span className="text-[10px] font-medium">Tasks</span>
        </button>
        <button
          onClick={() => onNavigate(15)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Laptop size={18} />
          <span className="text-[10px] font-medium">Devices</span>
        </button>
        <button
          onClick={() => onNavigate(17)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <History size={18} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button
          onClick={() => onNavigate(16)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <Settings size={18} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
