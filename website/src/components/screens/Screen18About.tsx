"use client";

import React, { useState } from "react";
import RobotLogo from "../RobotLogo";
import {
  ArrowLeft,
  ShieldCheck,
  FileText,
  HelpCircle,
  Activity,
  Cpu,
  ChevronRight,
  Heart,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen18About({ onNavigate, isLightMode }: ScreenProps) {
  const [modalText, setModalText] = useState<string | null>(null);

  const items = [
    {
      title: "Privacy Policy",
      icon: ShieldCheck,
      action: () =>
        setModalText(
          "ROBO Privacy Policy:\n\nAll voice processing, contacts management, and message handling respect end-to-end privacy. No WhatsApp messages or contacts are shared with third-party advertisers. Offline models run directly via local inference."
        ),
    },
    {
      title: "Terms of Service",
      icon: FileText,
      action: () =>
        setModalText(
          "ROBO Terms of Service:\n\nROBO is provided as a personal agent assistant. You retain full ownership of your credentials and data. Actions such as phone dialing and WhatsApp drafting require explicit user initiation and approval."
        ),
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      action: () =>
        setModalText(
          "Help & Support:\n\nNeed assistance? Visit github.com/akshar287/ROBO for troubleshooting guides, documentation, and issues reporting."
        ),
    },
    {
      title: "Feature Status",
      icon: Activity,
      action: () =>
        setModalText(
          "Active Modules:\n\n• Multilingual STT (Gujarati, Hindi, English): Operational\n• Zero-Token WhatsApp Deep Links: Active\n• Background Foreground Service: Ready\n• Laptop Agent Sync: Active"
        ),
    },
    {
      title: "Diagnostics",
      icon: Cpu,
      action: () =>
        setModalText(
          "System Diagnostics:\n\n• App Version: 1.0.0 (Production)\n• Database: SQLite Synced\n• Battery Optimization: Exempted\n• WebSocket Gateway: Port 8000"
        ),
    },
  ];

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
            onClick={() => onNavigate(16)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-base font-bold text-slate-100">About ROBO</h2>
        </div>

        {/* Mascot & Version */}
        <div className="flex flex-col items-center text-center my-3">
          <RobotLogo size={70} glow={true} />
          <h3 className="text-xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
            ROBO
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">Version 1.0.0</p>
        </div>

        {/* Menu list */}
        <div
          className={`rounded-2xl border divide-y overflow-hidden my-4 ${
            isLightMode
              ? "bg-white border-slate-200 divide-slate-100"
              : "bg-[#10192E] border-[#1D2B4A] divide-slate-800"
          }`}
        >
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={item.action}
                className="p-3.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="text-cyan-400" />
                  <span className="text-slate-200 font-semibold">{item.title}</span>
                </div>
                <ChevronRight size={14} className="text-slate-500" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Dialog */}
      {modalText && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#10192E] border border-cyan-500/40 rounded-2xl max-w-sm w-full p-5 shadow-2xl text-slate-100 space-y-4">
            <h4 className="text-sm font-bold text-cyan-400">Information</h4>
            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {modalText}
            </p>
            <button
              onClick={() => setModalText(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-2">
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
          <span>Made with</span>
          <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
          <span>by Akshar</span>
        </p>
      </div>
    </div>
  );
}
