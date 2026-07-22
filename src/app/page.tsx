"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Activity,
  Bot,
  Code,
  Database,
  LayoutDashboard,
  Search,
  Settings,
  Users,
  Send,
  Filter,
} from "lucide-react";
import type { SystemState, SystemEvent, SystemEventType } from "@/lib/types";
import { getSystemState } from "@/lib/mock-data";
import AgentGraph from "@/lib/components/AgentGraph";
import SkillTimeline from "@/lib/components/SkillTimeline";

export default function Home() {
  const [state, setState] = useState<SystemState | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState<SystemEventType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [injecting, setInjecting] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize state and set up SSE connection
  useEffect(() => {
    const data = getSystemState();
    setState(data);
    setLoading(false);

    // Connect to SSE
    const es = new EventSource("/api/events/stream");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "update" && msg.data) {
        setState(msg.data);
      }
    };

    es.onerror = (err) => {
      console.error("SSE error:", err);
    };

    return () => {
      es.close();
    };
  }, []);

  // Filter events
  const filteredEvents = state?.events.filter((event) => {
    const matchesFilter = eventFilter === "all" || event.type === eventFilter;
    const matchesSearch =
      searchQuery === "" ||
      event.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }) || [];

  // Handle goal injection
  const handleInjectGoal = async () => {
    if (!goalInput.trim()) return;
    setInjecting(true);
    try {
      await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goalInput }),
      });
      setGoalInput("");
    } catch (error) {
      console.error("Failed to inject goal:", error);
    } finally {
      setInjecting(false);
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen bg-gradient-cinematic hero-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          </div>
          <p className="text-slate-400 mt-4">Initializing Mission Control...</p>
          <p className="text-slate-500 text-sm mt-2">Connecting to agent system</p>
        </div>
      </div>
    );
  }

  const { metrics } = state;

  return (
    <div className="min-h-screen bg-gradient-cinematic hero-gradient">
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
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
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

        {/* Goal Injection */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Inject Goal</h2>
          <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                placeholder="Enter a new goal for the agent system..."
                className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => e.key === "Enter" && handleInjectGoal()}
              />
              <button
                onClick={handleInjectGoal}
                disabled={injecting || !goalInput.trim()}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-colors"
              >
                {injecting ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Inject
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Goals are injected as new tasks for agents to pick up.
            </p>
          </div>
        </section>

        {/* Live Agent Graph */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Live Agent Graph</h2>
          <AgentGraph
            agents={state.agents}
            skills={state.skills}
            graph={state.graph}
          />
        </section>

        {/* Skill Evolution Timeline */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Evolution</h2>
          <SkillTimeline skills={state.skills} />
        </section>

        {/* Activity Feed */}
        <section className="mb-8 fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Activity Feed</h2>
          <div className="bg-gradient-card border border-slate-800 rounded-xl">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-medium text-white">Event Feed</h3>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search events..."
                      className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value as any)}
                    className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="all">All Events</option>
                    <option value="agent_started">Agent Started</option>
                    <option value="agent_completed">Agent Completed</option>
                    <option value="skill_created">Skill Created</option>
                    <option value="skill_evolved">Skill Evolved</option>
                    <option value="task_started">Task Started</option>
                    <option value="task_completed">Task Completed</option>
                    <option value="tool_called">Tool Called</option>
                    <option value="error">Errors</option>
                    <option value="goal_injected">Goals</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {filteredEvents.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No events matching your filter</p>
                </div>
              ) : (
                filteredEvents.map((event) => (
                  <div key={event.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        event.type === "error" ? "bg-red-400" :
                        event.type === "goal_injected" ? "bg-purple-400" :
                        event.type === "agent_completed" ? "bg-green-400" :
                        event.type === "skill_evolved" ? "bg-amber-400" :
                        "bg-blue-400"
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">{event.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-slate-800 rounded-full text-slate-400">
                            {event.type}
                          </span>
                          {event.agentId && (
                            <span className="text-xs text-slate-500">
                              Agent: {event.agentId.substring(0, 8)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Memory Overview */}
        <section className="fade-in">
          <h2 className="text-lg font-semibold text-white mb-4">Memory Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger">
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-white">Memory Entries</h3>
              </div>
              <p className="text-3xl font-bold text-white">{metrics.memoryEntries}</p>
              <p className="text-sm text-slate-400 mt-1">Total entries across all agents</p>
            </div>
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-medium text-white">Total Agents</h3>
              </div>
              <p className="text-3xl font-bold text-white">{state.agents.length}</p>
              <p className="text-sm text-slate-400 mt-1">Active in the system</p>
            </div>
            <div className="bg-gradient-card border border-slate-800 rounded-xl p-6">
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
    <div className="bg-gradient-card border border-slate-800 rounded-xl p-6 transition-all duration-300 hover:border-slate-700">
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
