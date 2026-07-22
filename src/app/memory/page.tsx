"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, Search, Tag } from "lucide-react";
import type { MemoryEntry } from "@/lib/types";

export default function MemoryPage() {
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/memory")
      .then((res) => res.json())
      .then((data) => {
        setMemory(data);
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
              <h1 className="text-xl font-bold text-white">Memory Explorer</h1>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search memory..."
                className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="space-y-4">
          {memory.map((entry) => (
            <div key={entry.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <code className="text-sm font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {entry.key}
                    </code>
                    {entry.isBeingAttended && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-400">
                        Attended
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 mb-2">{entry.value}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-800 text-slate-400">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-4 text-xs text-slate-500">
                  <div>Agent: {entry.agentId.substring(0, 8)}...</div>
                  <div>Accessed: {new Date(entry.lastAccessed).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
