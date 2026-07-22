"use client";

import { useState } from "react";
import type { Skill } from "@/lib/types";
import { GitBranch, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SkillTimelineProps {
  skills: Skill[];
}

export default function SkillTimeline({ skills }: SkillTimelineProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(skills[0]);

  return (
    <div className="space-y-6">
      {/* Skill selector */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {skills.slice(0, 8).map((skill) => (
          <button
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedSkill?.id === skill.id
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-slate-800/30 text-slate-300 hover:bg-slate-700/30 border border-slate-700"
            }`}
          >
            {skill.name}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {selectedSkill && (
        <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{selectedSkill.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              selectedSkill.status === "active" ? "bg-green-500/20 text-green-400" :
              selectedSkill.status === "evolving" ? "bg-amber-500/20 text-amber-400" :
              "bg-slate-500/20 text-slate-400"
            }`}>
              {selectedSkill.status}
            </span>
          </div>

          <div className="space-y-4">
            {selectedSkill.versions.map((version, index) => {
              const isLatest = index === selectedSkill.versions.length - 1;
              const prevVersion = index > 0 ? selectedSkill.versions[index - 1] : null;
              const performanceChange = prevVersion
                ? version.performance.successRate - prevVersion.performance.successRate
                : 0;

              return (
                <div key={version.version} className="relative">
                  {/* Timeline line */}
                  {index < selectedSkill.versions.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-700" />
                  )}

                  <div className="flex gap-4">
                    {/* Version marker */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        isLatest
                          ? "border-blue-400 bg-blue-500/20"
                          : "border-slate-600 bg-slate-800"
                      }`}>
                        <span className="text-xs font-bold text-white">{version.version}</span>
                      </div>
                      {performanceChange !== 0 && (
                        <div className="mt-1 flex items-center gap-1">
                          {performanceChange > 0 ? (
                            <TrendingUp className="w-3 h-3 text-green-400" />
                          ) : performanceChange < 0 ? (
                            <TrendingDown className="w-3 h-3 text-red-400" />
                          ) : (
                            <Minus className="w-3 h-3 text-slate-500" />
                          )}
                          <span className={`text-xs ${
                            performanceChange > 0 ? "text-green-400" :
                            performanceChange < 0 ? "text-red-400" :
                            "text-slate-500"
                          }`}>
                            {performanceChange > 0 ? "+" : ""}{Math.round(performanceChange * 100)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Version details */}
                    <div className="flex-1 bg-slate-800/30 border border-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-400">
                            {new Date(version.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-400">
                            Usage: {version.performance.usageCount}
                          </span>
                          <span className="text-slate-400">
                            Success: {Math.round(version.performance.successRate * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Code preview */}
                      <pre className="text-xs text-slate-300 bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                        {version.code}
                      </pre>

                      {/* Diff */}
                      {version.diff && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <GitBranch className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-medium text-slate-300">Changes</span>
                          </div>
                          <pre className="text-xs text-slate-300 bg-slate-900/50 rounded-lg p-3 overflow-x-auto">
                            {version.diff}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance summary */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-sm font-medium text-slate-300 mb-3">Performance Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{selectedSkill.performance.usageCount}</div>
                <div className="text-xs text-slate-400">Total Usage</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round(selectedSkill.performance.successRate * 100)}%</div>
                <div className="text-xs text-slate-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round(selectedSkill.performance.avgExecutionTime)}ms</div>
                <div className="text-xs text-slate-400">Avg Time</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
