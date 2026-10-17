"use client";

import React, { useState, useEffect } from "react";
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
  Layers,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
} from "lucide-react";

export default function AppMaster() {
  const [currentScreen, setCurrentScreen] = useState<number>(7); // Default to Main Dashboard
  const [isLightMode, setIsLightMode] = useState<boolean>(false);
  const [showScreenDrawer, setShowScreenDrawer] = useState<boolean>(false);

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
    setShowScreenDrawer(false);
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return <Screen1Splash onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 2:
        return <Screen2Onboarding onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 3:
        return <Screen3Login onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 4:
        return <Screen4ConnectPhone onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 5:
        return <Screen5Permissions onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 6:
        return <Screen6PhoneConnected onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 7:
        return <Screen7Dashboard onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 8:
        return <Screen8VoiceAssistant onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 9:
        return <Screen9Chat onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 10:
        return <Screen10WhatsAppReply onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 11:
        return <Screen11NotificationAccess onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 12:
        return <Screen12SelectedContacts onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 13:
        return <Screen13CallScreen onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 14:
        return <Screen14LaptopControl onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 15:
        return <Screen15MyDevices onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 16:
        return <Screen16Settings onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 17:
        return <Screen17TaskHistory onNavigate={handleNavigate} isLightMode={isLightMode} />;
      case 18:
        return <Screen18About onNavigate={handleNavigate} isLightMode={isLightMode} />;
      default:
        return <Screen7Dashboard onNavigate={handleNavigate} isLightMode={isLightMode} />;
    }
  };

  return (
    <main
      className={`w-full min-h-screen select-none font-sans transition-colors duration-300 ${
        isLightMode ? "bg-slate-100 text-slate-900" : "bg-[#060A14] text-white"
      }`}
    >
      {/* Active Screen View (Full Screen, Real Mobile Layout) */}
      <div className="w-full min-h-screen flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
        {renderScreen()}
      </div>

      {/* Discreet Floating Screen Switcher Pill */}
      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-1.5 bg-[#0F172A]/90 border border-cyan-500/30 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg shadow-black/50 text-xs">
        <button
          onClick={() => handleNavigate(currentScreen > 1 ? currentScreen - 1 : 18)}
          className="text-slate-400 hover:text-cyan-400 active:scale-95 transition-all p-0.5"
          title="Previous Screen"
        >
          <ChevronLeft size={14} />
        </button>

        <button
          onClick={() => setShowScreenDrawer(!showScreenDrawer)}
          className="flex items-center gap-1.5 text-cyan-400 font-bold px-1.5 hover:text-cyan-300 transition-colors"
        >
          <Layers size={13} />
          <span>Screen {currentScreen}/19</span>
        </button>

        <button
          onClick={() => handleNavigate(currentScreen < 18 ? currentScreen + 1 : 1)}
          className="text-slate-400 hover:text-cyan-400 active:scale-95 transition-all p-0.5"
          title="Next Screen"
        >
          <ChevronRight size={14} />
        </button>

        <div className="w-[1px] h-3 bg-slate-700 mx-0.5" />

        <button
          onClick={toggleTheme}
          className="text-slate-400 hover:text-amber-400 active:scale-95 transition-colors p-0.5"
          title="Toggle Light/Dark Theme"
        >
          {isLightMode ? <Moon size={13} /> : <Sun size={13} />}
        </button>
      </div>

      {/* Screen Selection Modal Sheet */}
      {showScreenDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700/80 rounded-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white text-sm">Select Screen (19 Screens)</h3>
              </div>
              <button
                onClick={() => setShowScreenDrawer(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 overflow-y-auto pr-1 py-1 scrollbar-thin">
              {screenNames.map((s) => {
                const isSelected =
                  s.num === 19 ? isLightMode && currentScreen === 7 : currentScreen === s.num && !isLightMode;
                return (
                  <button
                    key={s.num}
                    onClick={() => handleNavigate(s.num)}
                    className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold shadow-md shadow-cyan-500/10"
                        : "bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
