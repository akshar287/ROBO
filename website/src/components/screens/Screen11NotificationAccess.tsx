"use client";

import React, { useState } from "react";
import { ArrowLeft, MessageSquare, ExternalLink, CheckCircle2, Shield } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen11NotificationAccess({ onNavigate, isLightMode }: ScreenProps) {
  const [accessEnabled, setAccessEnabled] = useState(true);

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div>
        {/* Back Nav */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => onNavigate(6)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-lg font-bold text-slate-100">Notification Access</h2>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Allow ROBO to read WhatsApp notifications to provide intelligent reply suggestions.
        </p>

        {/* Access Toggle Card */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between mb-6 transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-cyan-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center">
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">WhatsApp</h4>
              <p className="text-[11px] text-slate-400">
                {accessEnabled ? "Access granted" : "Access required"}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setAccessEnabled(!accessEnabled)}
            className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
              accessEnabled ? "bg-[#25D366]" : "bg-slate-700"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                accessEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* How to enable instructions card */}
        <div
          className={`p-4 rounded-2xl border ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#0B1327] border-[#182645]"
          } space-y-3`}
        >
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Shield size={14} className="text-cyan-400" />
            <span>How to enable?</span>
          </h4>

          <ol className="text-xs text-slate-300 space-y-2 pl-4 list-decimal marker:text-cyan-400 marker:font-bold">
            <li>Open Android System Settings</li>
            <li>Tap on Apps & Notifications</li>
            <li>Select Special App Access → Notification Access</li>
            <li>Turn on toggle for ROBO AI Agent</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onNavigate(12)} // Screen 12: Selected Contacts
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ExternalLink size={16} />
          <span>Open Settings</span>
        </button>

        <button
          onClick={() => onNavigate(7)}
          className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-slate-200"
        >
          Done, return to dashboard
        </button>
      </div>
    </div>
  );
}
