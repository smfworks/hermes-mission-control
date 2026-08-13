import { NextRequest, NextResponse } from "next/server";
import { injectGoal } from "@/lib/mock-data";
import { parseGoalBody } from "@/lib/goals";

/**
 * POST /api/goals
 * Inject a new goal into the in-memory demo store.
 * Unauthenticated. Local-demo only — see SECURITY.md.
 *
 * Body: { goal: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseGoalBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }
    const event = injectGoal(parsed.goal);
    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to inject goal" },
      { status: 500 }
    );
  }
}
