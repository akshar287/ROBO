"use client";

import React, { useState, useEffect } from "react";
import RobotLogo from "../RobotLogo";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen13CallScreen({ onNavigate, isLightMode }: ScreenProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 text-center transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2">
        <RobotLogo size={24} glow={false} />
        <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">
          ROBO Voice Call
        </span>
      </div>

      {/* Main Avatar & Calling Waveform */}
      <div className="my-auto flex flex-col items-center">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
          <div className="absolute w-36 h-36 rounded-full border border-blue-500/30 animate-pulse opacity-40" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-500 text-white flex items-center justify-center text-4xl shadow-xl shadow-rose-500/20 z-10 border-2 border-white/20">
            👩
          </div>
        </div>

        <p className="text-xs uppercase tracking-widest font-semibold text-emerald-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Calling... {formatTime(seconds)}</span>
        </p>
        <h3 className="text-2xl font-black text-slate-100 mt-1">Mom</h3>
        <p className="text-xs text-slate-400 mt-0.5 font-mono">+91 98765 43210</p>

        {/* Audio Waveform visualization */}
        <div className="flex items-center gap-1.5 mt-8 h-8">
          {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 65].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-full animate-pulse"
              style={{
                height: `${h}%`,
                animationDelay: `${i * 120}ms`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-center gap-8 mb-4">
        {/* Mute */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
            isMuted
              ? "bg-red-500/20 border border-red-500/40 text-red-400"
              : "bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700"
          }`}
        >
          {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          <span className="text-[9px] font-semibold">Mute</span>
        </button>

        {/* End Call Button */}
        <button
          onClick={() => onNavigate(7)} // Return to Dashboard
          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-xl shadow-red-600/30 active:scale-95 transition-all"
        >
          <PhoneOff size={26} />
        </button>

        {/* Speaker */}
        <button
          onClick={() => setIsSpeaker(!isSpeaker)}
          className={`w-14 h-14 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
            isSpeaker
              ? "bg-cyan-500/20 border border-cyan-500/40 text-cyan-400"
              : "bg-slate-800/80 border border-slate-700 text-slate-200 hover:bg-slate-700"
          }`}
        >
          {isSpeaker ? <Volume2 size={20} /> : <VolumeX size={20} />}
          <span className="text-[9px] font-semibold">Speaker</span>
        </button>
      </div>
    </div>
  );
}
