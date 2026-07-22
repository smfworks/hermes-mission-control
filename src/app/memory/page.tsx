"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, Search, Tag, Filter } from "lucide-react";
import type { MemoryEntry } from "@/lib/types";

export default function MemoryPage() {
  const [memory, setMemory] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    fetch("/api/memory")
      .then((res) => res.json())
      .then((data) => {
        setMemory(data);
        setLoading(false);
      });
  }, []);

  // Get unique tags
  const allTags = Array.from(
    new Set(memory.flatMap((entry) => entry.tags))
  ).sort();

  // Filter memory
  const filteredMemory = memory.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.value.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = tagFilter === "all" || entry.tags.includes(tagFilter);
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    return matchesSearch && matchesTag && matchesType;
  });

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
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search memory..."
                  className="pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Tags</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="structured">Structured</option>
                  <option value="unstructured">Unstructured</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-4 text-sm text-slate-400">
          Showing {filteredMemory.length} of {memory.length} entries
        </div>
        <div className="space-y-4">
          {filteredMemory.map((entry) => (
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
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      entry.type === "structured"
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {entry.type}
                    </span>
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
                  <div>Created: {new Date(entry.createdAt).toLocaleDateString()}</div>
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
