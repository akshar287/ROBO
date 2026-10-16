"use client";

import React from "react";
import { CheckCircle2, Clock, AlertTriangle, XCircle, Smartphone, Laptop, Server, ExternalLink, Mail, MessageSquare } from "lucide-react";

interface TaskQueueProps {
  tasks: any[];
  onReviewTask: (task: any) => void;
}

export const TaskQueue: React.FC<TaskQueueProps> = ({ tasks, onReviewTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-surface border border-surfaceBorder rounded-2xl p-8 text-center text-gray-400">
        <Clock className="w-8 h-8 mx-auto text-gray-500 mb-2 opacity-50" />
        <p className="text-sm font-medium">No tasks executed yet</p>
        <p className="text-xs text-gray-500 mt-1">Speak a voice command or click quick action to start.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-surfaceBorder rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white text-base">Execution History & Live Tasks</h3>
        <span className="text-xs text-gray-400 bg-background px-2.5 py-1 rounded-full border border-surfaceBorder">
          {tasks.length} tasks
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isPending = task.status === "pending_approval";
          const isCompleted = task.status === "completed";
          const isFailed = task.status === "failed";
          const firstStep = task.steps?.[0];
          const targetDev = firstStep?.target_device || "server";
          const params = firstStep?.parameters || {};

          return (
            <div
              key={task.task_id}
              className={`p-4 rounded-xl border transition-all ${
                isPending
                  ? "bg-amber-500/5 border-amber-500/30"
                  : isCompleted
                  ? "bg-background/80 border-surfaceBorder"
                  : "bg-surface border-surfaceBorder"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Status Icon */}
                  <div className="mt-0.5">
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    {isPending && <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse" />}
                    {isFailed && <XCircle className="w-5 h-5 text-red-400" />}
                    {!isCompleted && !isPending && !isFailed && (
                      <Clock className="w-5 h-5 text-sky-400 animate-spin" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      "{task.original_prompt}"
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-800 text-gray-300">
                        {targetDev === "android" ? (
                          <Smartphone className="w-3 h-3 text-emerald-400" />
                        ) : targetDev === "laptop" ? (
                          <Laptop className="w-3 h-3 text-sky-400" />
                        ) : (
                          <Server className="w-3 h-3 text-purple-400" />
                        )}
                        {targetDev.toUpperCase()}
                      </span>

                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-800/80 text-gray-400">
                        Lang: {task.detected_language}
                      </span>

                      {firstStep?.action && (
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400">
                          {firstStep.action}
                        </span>
                      )}
                    </div>

                    {task.result_summary && (
                      <p className="text-xs text-gray-400 mt-2 bg-background p-2 rounded-lg border border-surfaceBorder/60">
                        <span className="text-gray-300 font-medium">Result: </span>
                        {task.result_summary}
                      </p>
                    )}

                    {/* Direct 1-Click Action Buttons for instant user control */}
                    <div className="flex flex-wrap items-center gap-2 mt-2.5">
                      {params.web_gmail_url && (
                        <a
                          href={params.web_gmail_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Open Gmail Compose ({params.recipient})
                        </a>
                      )}

                      {params.web_url && (
                        <a
                          href={params.web_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Open WhatsApp Chat
                        </a>
                      )}

                      {params.url && !params.web_gmail_url && (
                        <a
                          href={params.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 text-xs font-medium transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open {params.url.includes("youtube") ? "YouTube" : params.url}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {isPending && (
                  <button
                    type="button"
                    onClick={() => onReviewTask(task)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold shadow-md transition-all flex-shrink-0"
                  >
                    Review Action
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
