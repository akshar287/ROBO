"use client";

import React, { useState } from "react";
import RobotLogo from "../RobotLogo";
import { Mic, Send, Phone, X, Sparkles, Volume2 } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen9Chat({ onNavigate, isLightMode }: ScreenProps) {
  const [inputText, setInputText] = useState("");

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-4 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <RobotLogo size={28} glow={false} />
          <div>
            <h3 className="text-sm font-black text-slate-100 flex items-center gap-1">
              <span>ROBO AI</span>
              <Sparkles size={13} className="text-cyan-400" />
            </h3>
            <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online & Connected</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(7)}
          className="w-8 h-8 rounded-full bg-slate-800/80 text-slate-300 flex items-center justify-center hover:bg-slate-700"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 py-4">
        {/* User Speech Bubble */}
        <div className="flex justify-end">
          <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-cyan-600 p-3.5 text-white shadow-md">
            <p className="text-sm font-semibold">મમ્મીને ફોન કરો.</p>
            <span className="block text-[10px] text-cyan-200 text-right mt-1">9:42 AM</span>
          </div>
        </div>

        {/* ROBO AI Bubble */}
        <div className="flex gap-2.5 items-start">
          <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-1">
            <RobotLogo size={20} glow={false} />
          </div>
          <div className="max-w-[85%] space-y-3">
            <div
              className={`rounded-2xl rounded-tl-sm p-3.5 border ${
                isLightMode
                  ? "bg-white border-slate-200 text-slate-800"
                  : "bg-[#10192E] border-[#1D2B4A] text-slate-100"
              }`}
            >
              <p className="text-xs leading-relaxed">
                I found your mom in your contacts. Do you want me to call her now?
              </p>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-cyan-400">
                <Volume2 size={12} />
                <span>Audio response played in Gujarati</span>
              </div>
            </div>

            {/* Contact Action Card */}
            <div
              className={`p-3.5 rounded-2xl border ${
                isLightMode ? "bg-white border-slate-200" : "bg-[#111C35] border-cyan-500/30"
              } shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 text-white font-bold flex items-center justify-center shrink-0 shadow-md text-sm">
                  👩
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Mom</h4>
                  <p className="text-[11px] text-slate-400">+91 98765 43210</p>
                </div>
              </div>

              {/* Call / Cancel Confirmation Actions */}
              <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onNavigate(13)} // Screen 13: Outgoing Call Screen!
                  className="py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                >
                  <Phone size={13} />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => onNavigate(7)}
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Input Bar */}
      <div
        className={`flex items-center gap-2 p-2 rounded-2xl border ${
          isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
        }`}
      >
        <button
          onClick={() => onNavigate(8)}
          className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 flex items-center justify-center shrink-0 transition-colors"
        >
          <Mic size={18} />
        </button>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none px-1"
        />
        <button
          onClick={() => {
            if (inputText.trim()) {
              setInputText("");
            }
          }}
          className="w-9 h-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20 hover:opacity-95 active:scale-95 transition-all"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
