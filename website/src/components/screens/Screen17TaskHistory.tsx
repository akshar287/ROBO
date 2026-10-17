"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Phone,
  Youtube,
  MessageSquare,
  Globe,
  ShoppingBag,
  Clock,
  ChevronRight,
} from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen17TaskHistory({ onNavigate, isLightMode }: ScreenProps) {
  const [activeTab, setActiveTab] = useState<"all" | "completed" | "failed">("all");

  const tasks = [
    {
      id: "1",
      title: "Call Mom",
      icon: Phone,
      color: "text-emerald-400 bg-emerald-500/15",
      time: "Completed • 5 min ago",
      status: "completed",
    },
    {
      id: "2",
      title: "Open YouTube",
      icon: Youtube,
      color: "text-red-400 bg-red-500/15",
      time: "Completed • 15 min ago",
      status: "completed",
    },
    {
      id: "3",
      title: "Reply on WhatsApp",
      icon: MessageSquare,
      color: "text-[#25D366] bg-[#25D366]/15",
      time: "Completed • 22 min ago",
      status: "completed",
    },
    {
      id: "4",
      title: "Search on Chrome",
      icon: Globe,
      color: "text-blue-400 bg-blue-500/15",
      time: "Completed • 1 hr ago",
      status: "completed",
    },
    {
      id: "5",
      title: "Open Play Store",
      icon: ShoppingBag,
      color: "text-purple-400 bg-purple-500/15",
      time: "Completed • 2 hr ago",
      status: "completed",
    },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

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
            onClick={() => onNavigate(7)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-base font-bold text-slate-100">Task History</h2>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#10192E] border border-[#1D2B4A] mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === "all"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === "completed"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("failed")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              activeTab === "failed"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Failed
          </button>
        </div>

        {/* Task Cards List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[400px] pr-1">
          {filteredTasks.length === 0 ? (
            <p className="text-xs text-center text-slate-500 py-8">No tasks recorded in this filter.</p>
          ) : (
            filteredTasks.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{t.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{t.time}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-500" />
                </div>
              );
            })
          )}
        </div>
      </div>

      <button
        onClick={() => onNavigate(7)}
        className="w-full mt-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
