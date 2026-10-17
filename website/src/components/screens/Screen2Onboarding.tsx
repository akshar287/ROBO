"use client";

import React from "react";
import RobotLogo from "../RobotLogo";
import { Mic, Laptop, Zap, ShieldCheck, ArrowRight } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen2Onboarding({ onNavigate, isLightMode }: ScreenProps) {
  const features = [
    {
      icon: Mic,
      title: "Voice Commands",
      desc: "Talk in Gujarati, Hindi or English",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Laptop,
      title: "Control Your Devices",
      desc: "Phone & Laptop seamless sync",
      color: "from-cyan-500 to-teal-400",
    },
    {
      icon: Zap,
      title: "Smart Automation",
      desc: "Apps, Messages, Calls & more",
      color: "from-indigo-500 to-blue-500",
    },
    {
      icon: ShieldCheck,
      title: "Works in Background",
      desc: "Even when the app or screen is closed",
      color: "from-sky-500 to-cyan-500",
    },
  ];

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode
          ? "bg-slate-50 text-slate-900"
          : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="flex flex-col items-center text-center mt-2">
        <RobotLogo size={60} glow={false} />
        <h2 className="text-2xl font-black mt-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
          Welcome to ROBO
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Your personal AI agent, always with you.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="space-y-3 my-6">
        {features.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                isLightMode
                  ? "bg-white border-slate-200 shadow-sm hover:border-cyan-400"
                  : "bg-[#10192E] border-[#1D2B4A] hover:border-cyan-500/50 shadow-md"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-tr ${f.color} text-white shadow-md`}
              >
                <Icon size={22} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-100">{f.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3">
        <button
          onClick={() => onNavigate(3)}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
        >
          <span>Get Started</span>
          <ArrowRight size={16} />
        </button>

        <div className="text-center">
          <button
            onClick={() => onNavigate(3)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Already have an account? <span className="text-cyan-400 font-semibold underline">Log in</span>
          </button>
        </div>
      </div>
    </div>
  );
}
