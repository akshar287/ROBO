"use client";

import React, { useState } from "react";
import { AlertCircle, Check, X, ShieldAlert, Mail, Phone } from "lucide-react";
import { api } from "@/lib/api";

interface ApprovalModalProps {
  task: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ task, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const firstStep = task.steps?.[0];
  const params = firstStep?.parameters || {};

  const handleApprove = async () => {
    setLoading(true);
    try {
      await api.approveTask(task.task_id);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error approving task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await api.rejectTask(task.task_id);
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("Error rejecting task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-surface border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center gap-3 text-amber-400 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Approval Required</h3>
            <p className="text-xs text-amber-400/90">Safety verification before dispatching external action</p>
          </div>
        </div>

        <div className="space-y-3 bg-background p-4 rounded-xl border border-surfaceBorder text-xs text-gray-300">
          <div>
            <span className="text-gray-400">Original Prompt:</span>
            <p className="text-white font-medium mt-0.5">"{task.original_prompt}"</p>
          </div>

          {params.recipient && (
            <div>
              <span className="text-gray-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-sky-400" /> Recipient:
              </span>
              <p className="text-white font-mono mt-0.5">{params.recipient}</p>
            </div>
          )}

          {params.subject && (
            <div>
              <span className="text-gray-400">Subject:</span>
              <p className="text-white font-semibold mt-0.5">{params.subject}</p>
            </div>
          )}

          {params.draft_body && (
            <div>
              <span className="text-gray-400">Complete Message Draft:</span>
              <div className="mt-1 p-3 bg-surface rounded-lg text-gray-200 whitespace-pre-line border border-surfaceBorder">
                {params.draft_body}
              </div>
            </div>
          )}

          {params.phone_number && (
            <div>
              <span className="text-gray-400 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Number:
              </span>
              <p className="text-white font-mono mt-0.5">{params.contact_name} ({params.phone_number})</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <X className="w-4 h-4 text-red-400" /> Reject
          </button>

          <button
            type="button"
            onClick={handleApprove}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
          >
            <Check className="w-4 h-4" /> Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
};
