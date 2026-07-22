import { NextResponse } from "next/server";
import { getSystemState } from "@/lib/mock-data";

export async function GET() {
  const state = getSystemState();
  return NextResponse.json({
    agents: state.agents,
    skills: state.skills,
    tasks: state.tasks,
    memory: state.memory,
    events: state.events,
    metrics: state.metrics,
    graph: state.graph,
  });
}
