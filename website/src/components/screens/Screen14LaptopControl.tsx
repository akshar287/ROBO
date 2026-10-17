"use client";

import React, { useState } from "react";
import {
  Laptop,
  Globe,
  Youtube,
  FolderOpen,
  Play,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen14LaptopControl({ onNavigate, isLightMode }: ScreenProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  const executeAction = (actionName: string) => {
    setFeedback(`Command "${actionName}" dispatched to laptop agent.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate(7)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Laptop size={18} className="text-cyan-400" />
              <span>Laptop Agent</span>
            </h2>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online • Windows 11</span>
            </p>
          </div>
        </div>

        {feedback && (
          <div className="mb-4 p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-semibold animate-pulse flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{feedback}</span>
          </div>
        )}

        {/* 2x2 Grid of Quick Actions */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            onClick={() => executeAction("Open Chrome")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-cyan-400"
                : "bg-[#10192E] border-[#1D2B4A] hover:border-cyan-500/50"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-2">
              <Globe size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Open Chrome</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Open any website</p>
          </button>

          <button
            onClick={() => executeAction("Open YouTube")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-red-400"
                : "bg-[#10192E] border-[#1D2B4A] hover:border-red-500/50"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center mb-2">
              <Youtube size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Open YouTube</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Search & play</p>
          </button>

          <button
            onClick={() => executeAction("Manage Files")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-cyan-400"
                : "bg-[#10192E] border-[#1D2B4A] hover:border-cyan-500/50"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-2">
              <FolderOpen size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Manage Files</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">View / organize</p>
          </button>

          <button
            onClick={() => executeAction("Run Task")}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-cyan-400"
                : "bg-[#10192E] border-[#1D2B4A] hover:border-cyan-500/50"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-2">
              <Play size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-100">Run Task</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">[Approved actions]</p>
          </button>
        </div>

        {/* Recent Activity List */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Recent Activity
          </h4>

          <div className="space-y-2">
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isLightMode ? "bg-white border-slate-200" : "bg-[#0B1327] border-[#172442]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Youtube size={16} className="text-red-400" />
                <span className="text-slate-200 font-medium">Opened YouTube</span>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock size={11} /> 10 mins ago
              </span>
            </div>

            <div
              className={`p-3 rounded-2xl border flex items-center justify-between text-xs ${
                isLightMode ? "bg-white border-slate-200" : "bg-[#0B1327] border-[#172442]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Globe size={16} className="text-cyan-400" />
                <span className="text-slate-200 font-medium">Searched for 'AI tools'</span>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock size={11} /> 25 mins ago
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate(7)}
        className="w-full mt-4 py-3 rounded-2xl border border-slate-700 text-slate-300 font-semibold text-xs hover:bg-slate-800"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
