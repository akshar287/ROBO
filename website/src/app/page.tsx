"use client";

import React, { useState } from "react";
import Screen1Splash from "@/components/screens/Screen1Splash";
import Screen2Onboarding from "@/components/screens/Screen2Onboarding";
import Screen3Login from "@/components/screens/Screen3Login";
import Screen4ConnectPhone from "@/components/screens/Screen4ConnectPhone";
import Screen5Permissions from "@/components/screens/Screen5Permissions";
import Screen6PhoneConnected from "@/components/screens/Screen6PhoneConnected";
import Screen7Dashboard from "@/components/screens/Screen7Dashboard";
import Screen8VoiceAssistant from "@/components/screens/Screen8VoiceAssistant";
import Screen9Chat from "@/components/screens/Screen9Chat";
import Screen10WhatsAppReply from "@/components/screens/Screen10WhatsAppReply";
import Screen11NotificationAccess from "@/components/screens/Screen11NotificationAccess";
import Screen12SelectedContacts from "@/components/screens/Screen12SelectedContacts";
import Screen13CallScreen from "@/components/screens/Screen13CallScreen";
import Screen14LaptopControl from "@/components/screens/Screen14LaptopControl";
import Screen15MyDevices from "@/components/screens/Screen15MyDevices";
import Screen16Settings from "@/components/screens/Screen16Settings";
import Screen17TaskHistory from "@/components/screens/Screen17TaskHistory";
import Screen18About from "@/components/screens/Screen18About";
import {
  Wifi,
  Battery,
  Signal,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";

export default function AppMaster() {
  const [currentScreen, setCurrentScreen] = useState<number>(7); // Default to Dashboard (Screen 7)
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const screenNames = [
    { num: 1, name: "1. Splash Screen" },
    { num: 2, name: "2. Onboarding" },
    { num: 3, name: "3. Login & Sign Up" },
    { num: 4, name: "4. Connect Phone" },
    { num: 5, name: "5. Permissions" },
    { num: 6, name: "6. Phone Connected" },
    { num: 7, name: "7. Main Dashboard" },
    { num: 8, name: "8. Voice (Listening)" },
    { num: 9, name: "9. Chat / Response" },
    { num: 10, name: "10. WhatsApp Reply" },
    { num: 11, name: "11. Notification Setup" },
    { num: 12, name: "12. Contacts" },
    { num: 13, name: "13. Call Screen" },
    { num: 14, name: "14. Laptop Control" },
    { num: 15, name: "15. My Devices" },
    { num: 16, name: "16. Settings" },
    { num: 17, name: "17. Task History" },
    { num: 18, name: "18. About / Info" },
    { num: 19, name: "19. Light Mode" },
  ];

  const handleNavigate = (screenNum: number) => {
    if (screenNum === 19) {
      setIsLightMode(true);
      setCurrentScreen(7);
    } else {
      setCurrentScreen(screenNum);
    }
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-start p-3 sm:p-6 overflow-x-hidden">
      {/* Top Controls & Screen Switcher Bar */}
      <div className="w-full max-w-5xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1327]/90 border border-slate-800/80 backdrop-blur-md p-3.5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-xs shadow-md">
            R
          </div>
          <div>
            <h1 className="text-sm font-black text-white flex items-center gap-1.5">
              <span>ROBO AI AGENT</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                19 Screens UI/UX
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Interactive high-fidelity mockup matching master specifications
            </p>
          </div>
        </div>

        {/* Screen Selector Dropdown & Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <button
            onClick={() => handleNavigate(currentScreen > 1 ? currentScreen - 1 : 18)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
            title="Previous Screen"
          >
            <ChevronLeft size={16} />
          </button>

          <select
            value={isLightMode && currentScreen === 7 ? 19 : currentScreen}
            onChange={(e) => {
              const val = Number(e.target.value);
              if (val === 19) {
                setIsLightMode(true);
                setCurrentScreen(7);
              } else {
                if (val !== 7) setIsLightMode(false);
                setCurrentScreen(val);
              }
            }}
            className="bg-[#10192E] text-cyan-400 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer hover:border-cyan-400"
          >
            {screenNames.map((s) => (
              <option key={s.num} value={s.num}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleNavigate(currentScreen < 18 ? currentScreen + 1 : 1)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 active:scale-95 transition-all"
            title="Next Screen"
          >
            <ChevronRight size={16} />
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              isLightMode
                ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-400"
            }`}
          >
            {isLightMode ? <Sun size={14} /> : <Moon size={14} />}
            <span>{isLightMode ? "Light" : "Dark"}</span>
          </button>
        </div>
      </div>

      {/* Screen Quick-Pill Badges */}
      <div className="w-full max-w-5xl mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center gap-1.5 px-1">
        {screenNames.map((s) => {
          const isSelected =
            s.num === 19 ? isLightMode && currentScreen === 7 : currentScreen === s.num && !isLightMode;
          return (
            <button
              key={s.num}
              onClick={() => handleNavigate(s.num)}
              className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                isSelected
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      {/* Realistic Mobile Device Container Frame */}
      <div className="relative w-full max-w-[400px] rounded-[44px] p-3 shadow-2xl bg-[#0F172A] border-4 border-slate-800/80 shadow-cyan-500/10">
        {/* Dynamic Island / Earpiece */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-40 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-[#182138] mr-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#0d1424]" />
        </div>

        {/* Screen Display Area */}
        <div className="relative w-full rounded-[36px] overflow-hidden bg-black min-h-[680px] flex flex-col justify-between shadow-inner">
          {/* iOS / Android Native Status Bar */}
          <div className="w-full h-8 pt-2.5 px-6 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-300 z-30 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal size={12} />
              <Wifi size={12} />
              <div className="flex items-center gap-0.5">
                <span className="text-[9px] font-mono">100%</span>
                <Battery size={14} className="text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Body */}
          <div className="flex-1 w-full overflow-hidden flex flex-col">
            {currentScreen === 1 && <Screen1Splash onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 2 && <Screen2Onboarding onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 3 && <Screen3Login onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 4 && <Screen4ConnectPhone onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 5 && <Screen5Permissions onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 6 && <Screen6PhoneConnected onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 7 && <Screen7Dashboard onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 8 && <Screen8VoiceAssistant onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 9 && <Screen9Chat onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 10 && <Screen10WhatsAppReply onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 11 && <Screen11NotificationAccess onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 12 && <Screen12SelectedContacts onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 13 && <Screen13CallScreen onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 14 && <Screen14LaptopControl onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 15 && <Screen15MyDevices onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 16 && (
              <Screen16Settings
                onNavigate={handleNavigate}
                isLightMode={isLightMode}
                onToggleTheme={toggleTheme}
              />
            )}
            {currentScreen === 17 && <Screen17TaskHistory onNavigate={handleNavigate} isLightMode={isLightMode} />}
            {currentScreen === 18 && <Screen18About onNavigate={handleNavigate} isLightMode={isLightMode} />}
          </div>

          {/* Home Bar */}
          <div className="w-full h-4 pb-2 flex items-center justify-center z-30 select-none">
            <div className="w-32 h-1 rounded-full bg-slate-500/50" />
          </div>
        </div>
      </div>

      {/* Footer Instructions */}
      <div className="mt-8 text-center text-xs text-slate-500 max-w-md">
        <p>
          💡 <span className="font-semibold text-slate-400">Pro-tip:</span> You can click through any button inside the phone frame to navigate naturally, or use the top menu to preview all 19 screens.
        </p>
      </div>
    </div>
  );
}
