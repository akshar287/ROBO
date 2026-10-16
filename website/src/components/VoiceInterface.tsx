"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, Volume2, Globe, ExternalLink, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";

interface VoiceInterfaceProps {
  onTaskTriggered: (task: any) => void;
  isAgentOn: boolean;
}

export const VoiceInterface: React.FC<VoiceInterfaceProps> = ({ onTaskTriggered, isAgentOn }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [selectedLang, setSelectedLang] = useState<"gu-IN" | "hi-IN" | "en-IN">("gu-IN");
  const [statusMessage, setStatusMessage] = useState("Tap microphone and speak");
  const [spokenReply, setSpokenReply] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastActionUrl, setLastActionUrl] = useState<{ url: string; label: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const recognizedTextRef = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage("Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = selectedLang;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage(null);
      recognizedTextRef.current = "";
      setStatusMessage(
        selectedLang === "gu-IN"
          ? "હું સાંભળી રહ્યો છું... ગુજરાતીમાં બોલો"
          : selectedLang === "hi-IN"
          ? "मैं सुन रहा हूँ... बोलिए"
          : "Listening... Speak now"
      );
    };

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = 0; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const current = final || interim;
      if (current) {
        recognizedTextRef.current = current;
        setTranscript(current);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        setErrorMessage("Microphone permission denied. Please allow microphone access in your browser URL bar.");
      } else if (event.error === "no-speech") {
        setStatusMessage("No speech heard. Click the mic and try speaking again.");
      } else {
        setStatusMessage("Microphone idle. Ready for command.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      const textToExecute = recognizedTextRef.current.trim();
      if (textToExecute) {
        handleExecute(textToExecute);
      } else {
        setStatusMessage("Tap microphone and speak");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch (e) {}
    };
  }, [selectedLang]); // Only re-run when language changes, NEVER on transcript!

  const toggleListening = async () => {
    if (!isAgentOn) {
      alert("ROBO is currently turned OFF. Please toggle the Master Switch ON first.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      return;
    }

    setTranscript("");
    recognizedTextRef.current = "";
    setSpokenReply(null);
    setLastActionUrl(null);
    setErrorMessage(null);

    // Explicitly prompt for mic permission if needed
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      recognitionRef.current?.start();
    } catch (err: any) {
      console.warn("Could not start recognition:", err);
      setErrorMessage("Please grant microphone permission to speak.");
      // Fallback start attempt anyway
      try {
        recognitionRef.current?.start();
      } catch (e) {}
    }
  };

  const handleExecute = async (promptText: string) => {
    if (!promptText.trim()) return;
    setStatusMessage(`Processing: "${promptText}"`);
    setLastActionUrl(null);

    try {
      const res = await api.executeTask(promptText);
      onTaskTriggered(res);
      setSpokenReply(res.spoken_response);
      setStatusMessage("Command executed successfully!");

      const params = res.parameters || {};

      // Auto-open target apps/URLs
      if (params.web_gmail_url) {
        setLastActionUrl({ url: params.web_gmail_url, label: "Open in Gmail Web Composer" });
        window.open(params.web_gmail_url, "_blank");
      } else if (params.web_url) {
        setLastActionUrl({ url: params.web_url, label: "Open in WhatsApp Web" });
        window.open(params.web_url, "_blank");
      } else if (params.url) {
        setLastActionUrl({ url: params.url, label: `Open ${params.url.includes("youtube") ? "YouTube" : params.url}` });
        window.open(params.url, "_blank");
      }

      // Spoken voice synthesis back to user
      if (res.spoken_response && typeof window !== "undefined" && "speechSynthesis" in window) {
        speakResponse(res.spoken_response, res.detected_language);
      }
    } catch (err: any) {
      setStatusMessage("Execution error: " + err.message);
    }
  };

  const speakResponse = (text: string, langCode: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (langCode.includes("gu")) utterance.lang = "gu-IN";
    else if (langCode.includes("hi")) utterance.lang = "hi-IN";
    else utterance.lang = "en-IN";

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleExecute(textInput);
      setTextInput("");
    }
  };

  return (
    <div className="bg-surface border border-surfaceBorder rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Language Selector Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Globe className="w-4 h-4 text-sky-400" />
          <span>Recognition Language:</span>
        </div>
        <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-surfaceBorder">
          {[
            { code: "gu-IN", label: "ગુજરાતી (Gujarati)" },
            { code: "hi-IN", label: "हिन्दी (Hindi)" },
            { code: "en-IN", label: "English" },
          ].map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setSelectedLang(lang.code as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedLang === lang.code
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Voice Mic Centerpiece */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="relative">
          {/* Wave Ping Animation */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
          )}

          <button
            type="button"
            onClick={toggleListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer ${
              !isAgentOn
                ? "bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700"
                : isListening
                ? "bg-red-500 text-white scale-110 shadow-red-500/50 glow-active animate-pulse"
                : "bg-gradient-to-tr from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/40 hover:scale-105"
            }`}
          >
            <Mic className={`w-10 h-10 ${isListening ? "animate-bounce" : ""}`} />
          </button>
        </div>

        <p className="mt-5 text-sm font-medium text-gray-300 flex items-center gap-2 text-center max-w-md">
          {isListening && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
          {transcript ? `"${transcript}"` : statusMessage}
        </p>

        {spokenReply && (
          <div className="mt-4 max-w-lg w-full p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs sm:text-sm flex items-start gap-3">
            <Volume2 className={`w-5 h-5 flex-shrink-0 text-sky-400 ${isSpeaking ? "animate-pulse" : ""}`} />
            <div className="flex-1">
              <p className="font-semibold text-white mb-0.5">ROBO Spoke:</p>
              <p>{spokenReply}</p>
              {lastActionUrl && (
                <a
                  href={lastActionUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 text-white font-medium text-xs hover:bg-sky-400 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {lastActionUrl.label}
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Text Command Input Alternative */}
      <form onSubmit={handleTextSubmit} className="mt-4 pt-4 border-t border-surfaceBorder">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Type command (or click mic above to speak in Gujarati, Hindi, or English)..."
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={!isAgentOn}
            className="w-full pl-4 pr-12 py-3 bg-background border border-surfaceBorder rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isAgentOn || !textInput.trim()}
            className="absolute right-2 p-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white disabled:opacity-30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
