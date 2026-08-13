"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Task } from "@/lib/types";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const statusIcons = {
    pending: Clock,
    in_progress: Clock,
    completed: CheckCircle,
    failed: XCircle,
  };

  const statusColors = {
    pending: "text-slate-400",
    in_progress: "text-blue-400",
    completed: "text-green-400",
    failed: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ←
              </Link>
              <h1 className="text-xl font-bold text-white">Tasks</h1>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          {tasks.map((task) => {
            const Icon = statusIcons[task.status];
            return (
              <div key={task.id} className="bg-gradient-card border border-slate-800 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Icon className={`w-5 h-5 mt-0.5 ${statusColors[task.status]}`} />
                    <div>
                      <h3 className="font-bold text-white">{task.title}</h3>
                      <p className="text-sm text-slate-300 mt-1">{task.description}</p>
                      {task.assignedAgent && (
                        <p className="text-sm text-slate-400 mt-1">Assigned to: {task.assignedAgent}</p>
                      )}
                      {task.result && (
                        <p className="text-sm text-green-400 mt-2">{task.result}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === "completed" ? "bg-green-500/20 text-green-400" :
                    task.status === "failed" ? "bg-red-500/20 text-red-400" :
                    task.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                    "bg-slate-500/20 text-slate-400"
                  }`}>
                    {task.status}
                  </span>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
