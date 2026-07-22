"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  Code,
  Database,
  Globe,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";
import type { SystemState } from "@/lib/types";
import { getSystemState } from "@/lib/mock-data";

export default function Home() {
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getSystemState();
    setState(data);
    setLoading(false);
  }, []);

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Mission Control...</p>
        </div>
      </div>
    );
  }

  const { metrics } = state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Hermes Mission Control</h1>
              <p className="text-sm text-slate-400">Real-time agent system observability</p>
            </div>
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/agents" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Agents
            </Link>
            <Link href="/skills" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Skills
            </Link>
            <Link href="/tasks" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Tasks
            </Link>
            <Link href="/memory" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
              Memory
            </Link>
            <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* System Metrics Cards */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Active Agents"
              value={metrics.activeAgents.toString()}
              icon={Users}
              color="blue"
            />
            <MetricCard
              title="Skills Evolving"
              value={metrics.skillsUnderEvolution.toString()}
              icon={Code}
              color="purple"
            />
            <MetricCard
              title="Tasks In Progress"
              value={metrics.tasksInProgress.toString()}
              icon={LayoutDashboard}
              color="amber"
            />
            <MetricCard
              title="Success Rate"
              value={`${Math.round(metrics.successRate * 100)}%`}
              icon={Activity}
              color="green"
            />
          </div>
        </section>

        {/* Live Agent Graph */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Live Agent Graph</h2>
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
            <div className="h-96 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Agent graph visualization coming soon</p>
                <p className="text-sm mt-2">Real-time force-directed graph of agents and skills</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Feed */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-medium text-white">Event Feed</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="divide-y divide-slate-800">
              {state.events.slice(0, 10).map((event) => (
                <div key={event.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-300">{event.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Memory Overview */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Memory Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">Memory Entries</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.memoryEntries}</p>
              <p className="text-sm text-slate-400 mt-1">Total entries across all agents</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-white">Total Agents</h3>
              </div>
              <p className="text-3xl font-bold text-white">{state.agents.length}</p>
              <p className="text-sm text-slate-400 mt-1">Active in the system</p>
            </div>
            <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="font-medium text-white">Total Skills</h3>
              </div>
              <p className="text-3xl font-bold text-white">{state.skills.length}</p>
              <p className="text-sm text-slate-400 mt-1">Available skills</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: "blue" | "purple" | "amber" | "green";
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    amber: "bg-amber-500/20 text-amber-400",
    green: "bg-green-500/20 text-green-400",
  };

  return (
    <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold text-white">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
    </div>
  );
}
