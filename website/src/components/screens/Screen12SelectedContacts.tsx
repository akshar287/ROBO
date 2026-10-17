"use client";

import React, { useState } from "react";
import { ArrowLeft, Search, Check, Users } from "lucide-react";

interface ScreenProps {
  onNavigate: (screen: number) => void;
  isLightMode?: boolean;
}

export default function Screen12SelectedContacts({ onNavigate, isLightMode }: ScreenProps) {
  const [search, setSearch] = useState("");
  const [contacts, setContacts] = useState([
    { id: "1", name: "Mom", phone: "+91 98765 43210", isGroup: false, checked: true, color: "from-pink-500 to-rose-400" },
    { id: "2", name: "Rahul", phone: "+91 98765 12345", isGroup: false, checked: true, color: "from-blue-600 to-cyan-500" },
    { id: "3", name: "Priya", phone: "+91 87654 32109", isGroup: false, checked: true, color: "from-purple-500 to-indigo-400" },
    { id: "4", name: "College Group", phone: "Group Chat • 18 members", isGroup: true, checked: false, color: "from-amber-500 to-orange-400" },
    { id: "5", name: "Friends", phone: "Group Chat • 5 members", isGroup: true, checked: false, color: "from-emerald-500 to-teal-400" },
  ]);

  const toggleContact = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className={`min-h-[640px] h-full flex flex-col justify-between p-5 transition-colors duration-300 ${
        isLightMode ? "bg-slate-50 text-slate-900" : "bg-[#070D1B] text-white"
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => onNavigate(6)}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center hover:bg-slate-700"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-100">Selected Contacts</h2>
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          Only messages from these contacts will be processed by ROBO.
        </p>

        {/* Search Bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl border mb-4 ${
            isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
          }`}
        >
          <Search size={16} className="text-slate-500 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 outline-none"
          />
        </div>

        {/* Contact List */}
        <div className="space-y-2.5 overflow-y-auto max-h-[360px] pr-1">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              onClick={() => toggleContact(contact.id)}
              className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                isLightMode ? "bg-white border-slate-200" : "bg-[#10192E] border-[#1D2B4A]"
              } ${contact.checked ? "border-cyan-500/50" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${contact.color} text-white font-bold flex items-center justify-center shrink-0 text-xs shadow-md`}
                >
                  {contact.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{contact.name}</h4>
                  <p className="text-[11px] text-slate-400">{contact.phone}</p>
                </div>
              </div>

              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  contact.checked ? "bg-cyan-500 text-black" : "bg-slate-800 border border-slate-700"
                }`}
              >
                {contact.checked && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={() => onNavigate(7)} // Return to Dashboard
        className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
      >
        Save Selected Contacts
      </button>
    </div>
  );
}
