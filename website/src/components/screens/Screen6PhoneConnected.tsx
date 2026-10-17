"use client";

import React from "react";
import RobotLogo from "../RobotLogo";
import { CheckCircle2, Users, Settings, ChevronRight, MessageSquare } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen6PhoneConnected({ onNavigate, isLightMode }: ScreenProps) {
  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="flex flex-col items-center text-center mt-4">
        <RobotLogo size={80} glow={true} />
        <h2 className="text-2xl font-black mt-3 text-slate-100 flex items-center justify-center gap-2">
          <span>Phone Connected!</span>
          <CheckCircle2 size={22} className="text-emerald-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Your Android device is now linked with ROBO.
        </p>
      </div>

      {/* Linked Phone Card matching design */}
      <div className="my-auto space-y-3">
        <div
          className={`p-4 rounded-2xl border transition-all ${
            isLightMode
              ? "bg-white border-slate-200 shadow-sm"
              : "bg-[#10192E] border-emerald-500/40 shadow-lg shadow-emerald-500/5"
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <MessageSquare size={24} />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100">Akshar's Phone</h4>
                <ChevronRight size={16} className="text-slate-500" />
              </div>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Android 14 • Online</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">+91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Secondary Setup Buttons */}
        <button
          onClick={() => onNavigate(12)} // Selected Contacts
          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
            isLightMode
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              : "bg-[#10192E] border-[#1D2B4A] text-slate-200 hover:border-cyan-500/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <Users size={18} className="text-cyan-400" />
            <span className="text-xs font-semibold">Manage Contacts</span>
          </div>
          <ChevronRight size={16} className="text-slate-500" />
        </button>

        <button
          onClick={() => onNavigate(11)} // Notification Setup
          className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
            isLightMode
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              : "bg-[#10192E] border-[#1D2B4A] text-slate-200 hover:border-cyan-500/50"
          }`}
        >
          <div className="flex items-center gap-3">
            <Settings size={18} className="text-indigo-400" />
            <span className="text-xs font-semibold">Device Settings</span>
          </div>
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      <button
        onClick={() => onNavigate(7)} // Main Dashboard
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
      >
        <span>Continue to Dashboard</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
