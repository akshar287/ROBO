"use client";

import React, { useState } from "react";
import { api } from "@/lib/api";
import { User, Phone, Mail, ShieldCheck, Zap } from "lucide-react";

interface LoginModalProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !email) {
      setError("Please enter both mobile number and email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await api.login(phone, email);
      localStorage.setItem("robo_token", res.access_token);
      localStorage.setItem("robo_user", JSON.stringify(res));
      onLoginSuccess(res);
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.login("9876543210", "user@robo.ai");
      localStorage.setItem("robo_token", res.access_token);
      localStorage.setItem("robo_user", JSON.stringify(res));
      onLoginSuccess(res);
    } catch (err: any) {
      setError("Quick login failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-surface border border-surfaceBorder rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">ROBO AI Assistant</h2>
          <p className="text-sm text-gray-400 mt-1">
            Zero-Token Personal AI for Android & Laptop
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-surfaceBorder rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
              <input
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-surfaceBorder rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-sky-500/25 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Enter ROBO Dashboard"}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-surfaceBorder text-center">
          <p className="text-xs text-gray-400 mb-2">Non-Technical Instant Access:</p>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 bg-gray-800/80 hover:bg-gray-800 border border-gray-700 rounded-xl text-gray-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            1-Click Demo Login (No Setup Needed)
          </button>
        </div>
      </div>
    </div>
  );
};
