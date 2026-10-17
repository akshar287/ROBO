"use client";

import React, { useState } from "react";
import { Smartphone, Link2, Users, PhoneCall, CheckCircle2 } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen4ConnectPhone({ onNavigate, isLightMode }: ScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [isPairing, setIsPairing] = useState(false);

  const handleConnect = () => {
    setIsPairing(true);
    setTimeout(() => {
      setIsPairing(false);
      onNavigate(5); // Navigate to Permissions Setup
    }, 1000);
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="flex flex-col items-center text-center mt-3">
        {/* Linked Devices Graphic */}
        <div className="relative w-24 h-24 my-2 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#101D38] to-[#1E325A] border border-cyan-500/40 flex items-center justify-center shadow-lg">
            <Smartphone size={32} className="text-cyan-400" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 border-2 border-[#070D1B] flex items-center justify-center text-white">
              <Link2 size={16} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black mt-2 text-slate-100">Connect Your Phone</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Unlock calling, contacts and more with your Android device.
        </p>
      </div>

      <div className="space-y-4 my-4">
        {/* Mobile Number Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Your mobile number
          </label>
          <div
            className={`flex items-center rounded-2xl border px-3 py-3 ${
              isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
            }`}
          >
            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300 border-r border-slate-700 pr-2.5 mr-2.5 shrink-0">
              <span className="text-base">🇮🇳</span> +91
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full bg-transparent text-sm font-semibold text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Feature Capabilities Preview Cards */}
        <div className="space-y-2.5">
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center">
                <Users size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200">Contacts Access</p>
                <p className="text-[11px] text-slate-400">Find saved contacts by name</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Optional
            </span>
          </div>

          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border ${
              isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <PhoneCall size={18} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-200">Calling Setup</p>
                <p className="text-[11px] text-slate-400">Use your phone's calling features</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-500/20 text-cyan-300 border border-cyan-500/30">
              Setup
            </span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleConnect}
          disabled={isPairing}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
        >
          {isPairing ? (
            <span className="animate-pulse">Pairing Device...</span>
          ) : (
            <>
              <Smartphone size={16} />
              <span>Connect Android Device</span>
            </>
          )}
        </button>

        <div className="text-center">
          <button
            onClick={() => onNavigate(7)}
            className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
