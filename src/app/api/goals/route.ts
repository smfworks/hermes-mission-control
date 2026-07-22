import { NextRequest, NextResponse } from "next/server";
import { injectGoal } from "@/lib/mock-data";

/**
 * POST /api/goals
 * Inject a new goal into the system.
 *
 * Body: { goal: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal } = body;

    if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
      return NextResponse.json(
        { error: "Goal is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const event = injectGoal(goal.trim());
    return NextResponse.json({ success: true, event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to inject goal" },
      { status: 500 }
    );
  }
}
