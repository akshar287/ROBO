"use client";

import React, { useState } from "react";
import RobotLogo from "../RobotLogo";
import { Eye, EyeOff, Lock, Phone, Mail } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen3Login({ onNavigate, isLightMode }: ScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("9876543210");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(4); // Navigate to Connect Your Phone
  };

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-6 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div className="flex flex-col items-center text-center mt-2">
        <RobotLogo size={60} glow={false} />
        <h2 className="text-xl font-black mt-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">
          ROBO
        </h2>
        <h3 className="text-lg font-bold text-slate-100 mt-1">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          {isSignUp ? "Connect all your devices with 1 login" : "Welcome back! Enter your details"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 my-4">
        {/* Mobile / Phone Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Mobile Number</label>
          <div
            className={`flex items-center rounded-2xl border px-3 py-2.5 transition-all ${
              isLightMode
                ? "bg-white border-slate-200 focus-within:border-cyan-500"
                : "bg-[#10192E] border-[#1D2B4A] focus-within:border-cyan-500"
            }`}
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 border-r border-slate-700 pr-2.5 mr-2.5 shrink-0">
              <span className="text-base">🇮🇳</span> +91
            </span>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter mobile number"
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
          <div
            className={`flex items-center rounded-2xl border px-3 py-2.5 transition-all ${
              isLightMode
                ? "bg-white border-slate-200 focus-within:border-cyan-500"
                : "bg-[#10192E] border-[#1D2B4A] focus-within:border-cyan-500"
            }`}
          >
            <Lock size={16} className="text-slate-400 mr-2 shrink-0" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-cyan-400"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Remember me</span>
          </label>
          <button type="button" className="text-cyan-400 hover:underline">
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 active:scale-95 transition-all"
        >
          {isSignUp ? "Sign Up" : "Login"}
        </button>

        {/* OR Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={() => onNavigate(4)}
          className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-semibold transition-all ${
            isLightMode
              ? "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
              : "bg-[#10192E] border-[#1D2B4A] text-slate-200 hover:bg-slate-800/80"
          }`}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </form>

      <div className="text-center pb-2">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span className="text-cyan-400 font-bold underline">
            {isSignUp ? "Sign In" : "Sign up"}
          </span>
        </button>
      </div>
    </div>
  );
}
