/** Goal-injection validation. Local-only, unauthenticated by design. */

export const MAX_GOAL_LENGTH = 2000;

export type GoalParseResult =
  | { ok: true; goal: string }
  | { ok: false; error: string };

export function parseGoalBody(body: unknown): GoalParseResult {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    return { ok: false, error: "JSON object with a goal field is required" };
  }
  const goal = (body as { goal?: unknown }).goal;
  if (typeof goal !== "string") {
    return { ok: false, error: "Goal is required and must be a non-empty string" };
  }
  const trimmed = goal.trim();
  if (trimmed.length === 0) {
    return { ok: false, error: "Goal is required and must be a non-empty string" };
  }
  if (trimmed.length > MAX_GOAL_LENGTH) {
    return { ok: false, error: `Goal exceeds ${MAX_GOAL_LENGTH} characters` };
  }
  return { ok: true, goal: trimmed };
}
