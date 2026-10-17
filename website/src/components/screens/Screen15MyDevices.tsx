"use client";

import React from "react";
import {
  Smartphone,
  Laptop,
  Plus,
  ChevronRight,
  Battery,
  Zap,
  Home,
  CheckSquare,
  History,
  Settings,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen15MyDevices({ onNavigate, isLightMode }: ScreenProps) {
  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div>
        <h2 className="text-xl font-black text-slate-100 mb-1">My Devices</h2>
        <p className="text-xs text-slate-400 mb-5">
          Real-time synchronization across your paired hardware.
        </p>

        {/* Devices List */}
        <div className="space-y-3">
          {/* Android Phone Card */}
          <div
            onClick={() => onNavigate(6)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-emerald-400"
                : "bg-[#10192E] border-emerald-500/40 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone size={22} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-100">Android Phone</h4>
                  <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-500" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>ROBO App v1.0.0</span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <Battery size={13} className="text-emerald-400" /> 78%
              </span>
            </div>
          </div>

          {/* Laptop (Windows) Card */}
          <div
            onClick={() => onNavigate(14)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              isLightMode
                ? "bg-white border-slate-200 hover:border-cyan-400"
                : "bg-[#10192E] border-cyan-500/40 hover:border-cyan-400"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Laptop size={22} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-slate-100">Laptop (Windows)</h4>
                  <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Online</span>
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-slate-500" />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              <span>ROBO Agent v1.0.0</span>
              <span className="flex items-center gap-1 text-slate-300 font-semibold">
                <Battery size={13} className="text-cyan-400" /> 65%
              </span>
            </div>
          </div>
        </div>

        {/* Add Device Button */}
        <button
          onClick={() => onNavigate(4)} // Connect Phone
          className={`w-full mt-4 py-3 rounded-2xl border border-dashed flex items-center justify-center gap-2 text-xs font-bold transition-all ${
            isLightMode
              ? "border-slate-300 text-slate-600 hover:bg-slate-100"
              : "border-slate-700 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400"
          }`}
        >
          <Plus size={16} />
          <span>Add Device</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div
        className={`flex items-center justify-around py-2.5 px-3 rounded-2xl border ${
          isLightMode ? "bg-white border-slate-200" : "bg-[#0B1327] border-[#172442]"
        }`}
      >
        <button
          onClick={() => onNavigate(7)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400"
        >
          <Home size={18} />
          <span className="text-[10px] font-medium">Home</span>
        </button>
        <button
          onClick={() => onNavigate(15)}
          className="flex flex-col items-center gap-1 text-cyan-400 font-bold"
        >
          <Laptop size={18} />
          <span className="text-[10px]">Devices</span>
        </button>
        <button
          onClick={() => onNavigate(17)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400"
        >
          <History size={18} />
          <span className="text-[10px] font-medium">History</span>
        </button>
        <button
          onClick={() => onNavigate(16)}
          className="flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-400"
        >
          <Settings size={18} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
}
