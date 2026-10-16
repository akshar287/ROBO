"use client";

import React from "react";
import { Smartphone, Laptop, Battery, BatteryCharging, PowerOff, CheckCircle2 } from "lucide-react";

interface DeviceCardProps {
  device: {
    device_id: string;
    device_name: string;
    device_type: "laptop" | "android" | string;
    os_version?: string;
    is_online: boolean;
    battery_level?: number | null;
    is_charging?: boolean;
    last_seen?: string;
  };
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const isAndroid = device.device_type === "android";
  const isOnline = Boolean(device.is_online);
  const batteryPct = device.battery_level !== undefined && device.battery_level !== null 
    ? Math.round(device.battery_level) 
    : null;

  return (
    <div className={`relative p-5 rounded-2xl border transition-all ${
      isOnline 
        ? "bg-surface border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
        : "bg-surface/40 border-gray-800/80"
    }`}>
      {/* Device Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            isOnline
              ? (isAndroid ? "bg-emerald-500/10 text-emerald-400" : "bg-sky-500/10 text-sky-400")
              : "bg-gray-800 text-gray-500"
          }`}>
            {isAndroid ? <Smartphone className="w-6 h-6" /> : <Laptop className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">{device.device_name}</h3>
            <p className="text-xs text-gray-400">{device.os_version || (isAndroid ? "Android Device" : "Windows Desktop")}</p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center gap-1.5 bg-background/80 px-2.5 py-1 rounded-full border border-surfaceBorder">
          <span className={`w-2 h-2 rounded-full ${
            isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
          }`} />
          <span className={`text-[11px] font-semibold ${
            isOnline ? "text-emerald-400" : "text-rose-400"
          }`}>
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Battery & Hardware Status */}
      <div className="space-y-2 pt-2 border-t border-surfaceBorder/60">
        {isOnline && batteryPct !== null ? (
          <>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1.5">
                {device.is_charging ? (
                  <BatteryCharging className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Battery className="w-4 h-4 text-gray-400" />
                )}
                Live Battery
              </span>
              <span className="font-medium text-white">{batteryPct}%</span>
            </div>

            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  batteryPct > 40 ? "bg-emerald-400" : batteryPct > 20 ? "bg-amber-400" : "bg-red-400"
                }`}
                style={{ width: `${batteryPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-emerald-400/90 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Connected
              </span>
              <span>Ready for tasks</span>
            </div>
          </>
        ) : (
          <div className="text-[11px] text-gray-400 py-1 flex items-start gap-1.5">
            <PowerOff className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
            <span>
              {isAndroid
                ? "Agent offline. Open the ROBO app on your phone to connect."
                : "Agent offline. Run 'python agent.py' or double-click 'run_agent.bat' in laptop-agent folder."
              }
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
