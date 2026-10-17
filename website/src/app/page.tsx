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

export default function AppMaster() {
  // Always start on Screen 1: Splash Screen
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [isLightMode, setIsLightMode] = useState<boolean>(false);

  const handleNavigate = (screenNum: number) => {
    if (screenNum === 19) {
      setIsLightMode(true);
      setCurrentScreen(7);
    } else {
      setCurrentScreen(screenNum);
    }
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
      {/* 100% Full-Screen Real Mobile App View */}
      <div className="w-full min-h-screen flex flex-col justify-between max-w-md mx-auto relative overflow-hidden">
        {renderScreen()}
      </div>
    </main>
  );
}
