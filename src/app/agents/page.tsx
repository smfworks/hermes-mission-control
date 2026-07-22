"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Bot, Search, Filter } from "lucide-react";
import type { Agent } from "@/lib/types";

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <header className="border-b border-slate-800 bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                ←
              </Link>
              <h1 className="text-xl font-bold text-white">Agents</h1>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search agents..."
                className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8 text-blue-400" />
                  <div>
                    <h3 className="font-bold text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-400 capitalize">{agent.type}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium status-${agent.status}`}>
                  {agent.status}
                </span>
              </div>
              {agent.currentTask && (
                <p className="text-sm text-slate-300 mb-2">Task: {agent.currentTask}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>{agent.skills.length} skills</span>
                <span>•</span>
                <span>Active: {new Date(agent.lastActive).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
