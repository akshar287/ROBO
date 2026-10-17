"use client";

import React, { useState } from "react";
import { MessageSquare, Send, X, Globe, Check, Edit2 } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen10WhatsAppReply({ onNavigate, isLightMode }: ScreenProps) {
  const [suggestedReply, setSuggestedReply] = useState("Yes, I'll be there tomorrow!");
  const [isSent, setIsSent] = useState(false);

  const handleSend = () => {
    setIsSent(true);
    // Open zero-token deep link or return to dashboard
    const cleanPhone = "919876512345";
    const encoded = encodeURIComponent(suggestedReply);
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`, "_blank");
    setTimeout(() => {
      onNavigate(7);
    }, 1200);
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] flex items-center justify-center">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-100">ROBO</h3>
            <p className="text-[11px] text-[#25D366] font-semibold">WhatsApp Reply Suggestion</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(7)}
          className="w-8 h-8 rounded-full bg-slate-800/80 text-slate-300 flex items-center justify-center hover:bg-slate-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="my-auto space-y-4">
        {/* Contact Info Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md">
            R
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100">From: Rahul</h4>
            <p className="text-[11px] text-slate-400">+91 98765 12345 • WhatsApp</p>
          </div>
        </div>

        {/* Incoming Message Bubble */}
        <div
          className={`p-4 rounded-2xl border ${
            isLightMode
              ? "bg-white border-slate-200"
              : "bg-[#10192E] border-[#1D2B4A]"
          } shadow-sm`}
        >
          <p className="text-xs font-semibold text-slate-200 leading-relaxed">
            "Are you coming to college tomorrow?"
          </p>
          <span className="block text-[10px] text-slate-500 text-right mt-1.5 font-mono">
            9:45 AM
          </span>
        </div>

        {/* Suggested Reply Box */}
        <div
          className={`p-4 rounded-2xl border ${
            isLightMode
              ? "bg-emerald-50/70 border-emerald-300"
              : "bg-[#0C1E26] border-emerald-500/40"
          } space-y-2`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
              <span>Suggested Reply</span>
            </span>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Globe size={11} className="text-cyan-400" />
              <span>Language: English</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={suggestedReply}
              onChange={(e) => setSuggestedReply(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-100 outline-none resize-none"
            />
            <span className="absolute bottom-0 right-0 text-[10px] text-slate-500 flex items-center gap-1">
              <Edit2 size={10} /> Editable
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleSend}
          disabled={isSent}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-slate-950 font-bold text-sm shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {isSent ? (
            <>
              <Check size={16} strokeWidth={3} />
              <span>Reply Dispatched!</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Send Reply</span>
            </>
          )}
        </button>

        <button
          onClick={() => onNavigate(7)}
          className="w-full py-3 rounded-2xl border border-slate-700 text-slate-400 hover:text-slate-200 font-semibold text-xs active:scale-95 transition-all"
        >
          Dismiss
        </button>

        <p className="text-[10px] text-center text-slate-500 leading-tight">
          This reply will be sent securely using WhatsApp's quick reply notification action.
        </p>
      </div>
    </div>
  );
}
