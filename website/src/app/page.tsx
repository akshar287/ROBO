"use client";

import React, { useState, useEffect } from "react";
import { api, getWebSocketUrl } from "@/lib/api";
import { LoginModal } from "@/components/LoginModal";
import { DeviceCard } from "@/components/DeviceCard";
import { VoiceInterface } from "@/components/VoiceInterface";
import { TaskQueue } from "@/components/TaskQueue";
import { ApprovalModal } from "@/components/ApprovalModal";
import { 
  Power, 
  ShieldAlert, 
  Smartphone, 
  Laptop, 
  PhoneCall, 
  MessageSquare, 
  Mail, 
  Compass, 
  ShoppingBag,
  Sparkles,
  LogOut,
  RefreshCw
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isAgentOn, setIsAgentOn] = useState<boolean>(true);
  const [devices, setDevices] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [reviewTask, setReviewTask] = useState<any>(null);
  const [loadingState, setLoadingState] = useState(false);

  // Initialize Auth & Data
  useEffect(() => {
    const savedUser = localStorage.getItem("robo_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }

    fetchInitialData();

    // Setup real-time WebSocket connection to backend
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket(getWebSocketUrl("website", `web-client-${Math.random().toString(36).substring(7)}`));
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "agent_state_update") {
            setIsAgentOn(msg.state === "ON");
          } else if (msg.type === "task_updated") {
            // Refresh tasks
            loadTasks();
          }
        } catch (e) {}
      };
    } catch (e) {
      console.warn("WebSocket connect error:", e);
    }

    // Polling fallback every 6 seconds
    const interval = setInterval(() => {
      loadDevices();
      loadTasks();
    }, 6000);

    return () => {
      clearInterval(interval);
      ws?.close();
    };
  }, []);

  const fetchInitialData = async () => {
    try {
      const stateRes = await api.getAgentState();
      setIsAgentOn(stateRes.agent_state === "ON");
    } catch (e) {}
    loadDevices();
    loadTasks();
  };

  const loadDevices = async () => {
    try {
      const devList = await api.listDevices();
      setDevices(devList);
    } catch (e) {}
  };

  const loadTasks = async () => {
    try {
      const taskList = await api.listTasks();
      setTasks(taskList);
    } catch (e) {}
  };

  const toggleAgentState = async () => {
    setLoadingState(true);
    const targetState = isAgentOn ? "OFF" : "ON";
    try {
      const res = await api.setAgentState(targetState as any);
      setIsAgentOn(res.agent_state === "ON");
    } catch (err: any) {
      alert("Error toggling agent state: " + err.message);
    } finally {
      setLoadingState(false);
    }
  };

  const triggerQuickAction = async (prompt: string) => {
    if (!isAgentOn) {
      alert("ROBO is OFF. Please turn the Master Switch ON first.");
      return;
    }
    try {
      await api.executeTask(prompt);
      loadTasks();
    } catch (err: any) {
      alert("Execution error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("robo_token");
    localStorage.removeItem("robo_user");
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      {/* Login Modal for unauthenticated users */}
      {!user && <LoginModal onLoginSuccess={(u) => setUser(u)} />}

      {/* Review / Approval Modal */}
      {reviewTask && (
        <ApprovalModal
          task={reviewTask}
          onClose={() => setReviewTask(null)}
          onSuccess={() => {
            loadTasks();
            setReviewTask(null);
          }}
        />
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-surfaceBorder bg-surface/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg text-white tracking-wide">ROBO AI</h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  JARVIS ENGINE
                </span>
              </div>
              <p className="text-xs text-gray-400">Multilingual Personal AI Agent</p>
            </div>
          </div>

          {/* Master ON/OFF Toggle & User Section */}
          <div className="flex items-center gap-4">
            {/* Master Switch */}
            <div className="flex items-center gap-2.5 bg-background px-3 py-1.5 rounded-2xl border border-surfaceBorder">
              <span className={`text-xs font-semibold ${isAgentOn ? "text-emerald-400" : "text-gray-400"}`}>
                ROBO {isAgentOn ? "ACTIVE" : "OFF"}
              </span>
              <button
                type="button"
                onClick={toggleAgentState}
                disabled={loadingState}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  isAgentOn ? "bg-emerald-500 glow-active" : "bg-gray-700"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                    isAgentOn ? "translate-x-8" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* User Profile & Logout */}
            {user && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-surfaceBorder">
                <div className="text-right">
                  <p className="text-xs font-medium text-white">{user.full_name || "User"}</p>
                  <p className="text-[10px] text-gray-400">{user.phone}</p>
                </div>
                <button
                  onClick={handleLogout}
                  title="Log out"
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-surface transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* Quick 1-Click Verification Strip (Zero tokens required) */}
        <div className="mb-6 bg-surface/80 border border-surfaceBorder rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Instant Zero-Token Actions
            </span>
            <span className="text-xs text-gray-400">Click to execute across phone & laptop</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            <button
              onClick={() => triggerQuickAction("મમ્મીને ફોન કરો.")}
              className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl text-left transition-all group"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-white">Call Mummy</p>
              <p className="text-[11px] text-gray-400">મમ્મીને ફોન કરો</p>
            </button>

            <button
              onClick={() => triggerQuickAction("ROBO, WhatsApp par Rahul ko message draft karo")}
              className="p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl text-left transition-all group"
            >
              <MessageSquare className="w-4 h-4 text-green-400 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-white">WhatsApp Rahul</p>
              <p className="text-[11px] text-gray-400">Zero-token send</p>
            </button>

            <button
              onClick={() => triggerQuickAction("Open Gmail and summarize my unread emails.")}
              className="p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-left transition-all group"
            >
              <Mail className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-white">Check Gmail</p>
              <p className="text-[11px] text-gray-400">Summarize unread</p>
            </button>

            <button
              onClick={() => triggerQuickAction("Mere laptop par Chrome kholo aur YouTube open karo")}
              className="p-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 rounded-xl text-left transition-all group"
            >
              <Compass className="w-4 h-4 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-white">Laptop Chrome</p>
              <p className="text-[11px] text-gray-400">Open YouTube</p>
            </button>

            <button
              onClick={() => triggerQuickAction("Play Store kholo aur is application ko search karo")}
              className="p-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-xl text-left transition-all group col-span-2 sm:col-span-1"
            >
              <ShoppingBag className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-semibold text-white">Play Store</p>
              <p className="text-[11px] text-gray-400">Search apps</p>
            </button>
          </div>
        </div>

        {/* 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Voice Interface + Connected Devices (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Multilingual Voice Center */}
            <VoiceInterface
              isAgentOn={isAgentOn}
              onTaskTriggered={(t) => loadTasks()}
            />

            {/* Connected Devices Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Connected Devices</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <button
                  onClick={loadDevices}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {devices.length > 0 ? (
                  devices.map((dev) => <DeviceCard key={dev.device_id} device={dev} />)
                ) : (
                  <div className="col-span-2 p-6 rounded-2xl bg-surface/30 border border-dashed border-gray-800 text-center text-xs text-gray-400">
                    Connecting to device hub...
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Execution History & Tasks (5 cols) */}
          <div className="lg:col-span-5">
            <TaskQueue
              tasks={tasks}
              onReviewTask={(t) => setReviewTask(t)}
            />
          </div>

        </div>
      </div>
    </main>
  );
}
