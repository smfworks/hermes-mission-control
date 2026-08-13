import { describe, expect, it } from "vitest";
import { MAX_GOAL_LENGTH, parseGoalBody } from "@/lib/goals";

describe("parseGoalBody", () => {
  it("accepts a trimmed nonempty string", () => {
    expect(parseGoalBody({ goal: "  ship the release  " })).toEqual({
      ok: true,
      goal: "ship the release",
    });
  });

  it("rejects missing, empty, non-string, and oversized goals", () => {
    expect(parseGoalBody(null).ok).toBe(false);
    expect(parseGoalBody([]).ok).toBe(false);
    expect(parseGoalBody({}).ok).toBe(false);
    expect(parseGoalBody({ goal: "" }).ok).toBe(false);
    expect(parseGoalBody({ goal: "   " }).ok).toBe(false);
    expect(parseGoalBody({ goal: 12 }).ok).toBe(false);
    expect(parseGoalBody({ goal: "x".repeat(MAX_GOAL_LENGTH + 1) }).ok).toBe(false);
  });

  it("accepts a goal at the length cap", () => {
    const goal = "x".repeat(MAX_GOAL_LENGTH);
    expect(parseGoalBody({ goal })).toEqual({ ok: true, goal });
  });
});
