"use client";

import React, { useState } from "react";
import { Bell, Users, Phone, MapPin, Check, ChevronRight } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen5Permissions({ onNavigate, isLightMode }: ScreenProps) {
  const [permissions, setPermissions] = useState({
    notifications: true,
    contacts: true,
    calls: true,
    location: false,
  });

  const toggle = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="text-center mt-3">
        <h2 className="text-2xl font-black text-slate-100">Permissions Required</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
          ROBO needs a few permissions to work properly on your device.
        </p>
      </div>

      <div className="space-y-3 my-auto py-2">
        {/* Notification Access */}
        <div
          onClick={() => toggle("notifications")}
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } ${permissions.notifications ? "border-cyan-500/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center">
              <Bell size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-100">Notification Access</p>
              <p className="text-[11px] text-slate-400">Read WhatsApp messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Required
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                permissions.notifications ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-600"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Contacts */}
        <div
          onClick={() => toggle("contacts")}
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } ${permissions.contacts ? "border-cyan-500/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-100">Contacts</p>
              <p className="text-[11px] text-slate-400">Find and call your contacts</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              Optional
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                permissions.contacts ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-600"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Phone Calls */}
        <div
          onClick={() => toggle("calls")}
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } ${permissions.calls ? "border-cyan-500/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <Phone size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-100">Phone Calls</p>
              <p className="text-[11px] text-slate-400">Use calling features</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              Optional
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                permissions.calls ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-600"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Location */}
        <div
          onClick={() => toggle("location")}
          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          } ${permissions.location ? "border-cyan-500/50" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <MapPin size={20} />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-100">Location</p>
              <p className="text-[11px] text-slate-400">For better context</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
              Optional
            </span>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                permissions.location ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-600"
              }`}
            >
              <Check size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onNavigate(6)} // Go to Phone Connected!
        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all"
      >
        <span>Continue</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
