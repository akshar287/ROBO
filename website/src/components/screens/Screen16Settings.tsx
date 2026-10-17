"use client";

import React from "react";
import {
  ArrowLeft,
  User,
  Shield,
  Volume2,
  Cpu,
  Bell,
  Sun,
  Moon,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
  onToggleTheme?: () => void;
}

export default function Screen16Settings({ onNavigate, isLightMode, onToggleTheme }: ScreenProps) {
  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(7)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-base font-bold text-slate-100">Settings</h2>
        </div>

        {/* Profile Card */}
        <div
          className={`p-3.5 rounded-2xl border flex items-center gap-3.5 ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-black flex items-center justify-center text-lg shadow-md">
            A
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-100">Akshar Thakkar</h4>
            <p className="text-xs text-slate-400">aksharthakkar@gmail.com</p>
          </div>
          <button
            onClick={() => onNavigate(3)} // Sign out
            className="text-slate-500 hover:text-red-400 p-1"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-3">
          {/* Agent Control */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Agent Control
            </h5>
            <div
              className={`rounded-2xl border divide-y overflow-hidden ${
                isLightMode
                  ? "bg-white border-slate-200 divide-slate-100"
                  : "bg-[#10192E] border-[#1D2B4A] divide-slate-800"
              }`}
            >
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">Agent Status</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  Active <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Voice & Language */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Voice & Language
            </h5>
            <div
              className={`rounded-2xl border divide-y overflow-hidden ${
                isLightMode
                  ? "bg-white border-slate-200 divide-slate-100"
                  : "bg-[#10192E] border-[#1D2B4A] divide-slate-800"
              }`}
            >
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">Language Detection</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  Auto <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">Voice Output</span>
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Gujarati • Hindi • English <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">TTS Engine</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  Local (Piper) <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
            </div>
          </div>

          {/* AI & Automation */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Intelligence
            </h5>
            <div
              className={`rounded-2xl border divide-y overflow-hidden ${
                isLightMode
                  ? "bg-white border-slate-200 divide-slate-100"
                  : "bg-[#10192E] border-[#1D2B4A] divide-slate-800"
              }`}
            >
              <div className="p-3 flex items-center justify-between text-xs">
                <span className="text-slate-200 font-medium">AI Model</span>
                <span className="text-cyan-400 font-semibold flex items-center gap-1">
                  Ollama (Local) <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
              <div
                onClick={() => onNavigate(12)}
                className="p-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/40"
              >
                <span className="text-slate-200 font-medium">WhatsApp Allowlist</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  3 Contacts <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
            </div>
          </div>

          {/* Appearance & About */}
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              General
            </h5>
            <div
              className={`rounded-2xl border divide-y overflow-hidden ${
                isLightMode
                  ? "bg-white border-slate-200 divide-slate-100"
                  : "bg-[#10192E] border-[#1D2B4A] divide-slate-800"
              }`}
            >
              <div
                onClick={onToggleTheme}
                className="p-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/40"
              >
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  {isLightMode ? <Moon size={14} /> : <Sun size={14} className="text-yellow-400" />}
                  <span>Appearance</span>
                </span>
                <span className="text-slate-300 font-semibold">
                  {isLightMode ? "Light Mode" : "Dark Navy (Default)"}
                </span>
              </div>

              <div
                onClick={() => onNavigate(18)} // Screen 18: About
                className="p-3 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/40"
              >
                <span className="text-slate-200 font-medium flex items-center gap-2">
                  <Info size={14} className="text-cyan-400" />
                  <span>About & Help</span>
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  v1.0.0 <ChevronRight size={14} className="text-slate-500" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate(7)}
        className="w-full mt-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
      >
        Done
      </button>
    </div>
  );
}
