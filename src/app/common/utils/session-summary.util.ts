import { SessionRecord } from "../../models/session-record ";
import { SessionSummary } from "../../models/session-summary ";

/**
 * ✅ Generate summarized session data from raw step records
 * @param sessions Raw session records (step-level)
 */
export function summarizeSessions(sessions: SessionRecord[]): SessionSummary[] {
  if (!sessions || sessions.length === 0) return [];

  const sessionGroups = new Map<number, SessionRecord[]>();

  // Group steps by sessionId
  sessions.forEach((record) => {
    if (!sessionGroups.has(record.sessionId)) {
      sessionGroups.set(record.sessionId, []);
    }
    sessionGroups.get(record.sessionId)!.push(record);
  });

  // Compute average/total values per session
  const summaries: SessionSummary[] = [];
  sessionGroups.forEach((steps, sessionId) => {
    const moduleId = steps[0].moduleId;
    const avgAccuracy =
      steps.reduce((sum, s) => sum + s.accuracy, 0) / steps.length;
    const avgWpm = steps.reduce((sum, s) => sum + s.wpm, 0) / steps.length;
    const totalTimeSeconds = steps.reduce(
      (sum, s) => sum + s.stepTimeSeconds,
      0
    );
    const dateTime = steps[0].dateTime; // use first step's timestamp
    const isCompleted = steps.every((s) => s.isCompleted);

    summaries.push({
      sessionId,
      moduleId,
      avgAccuracy: Math.round(avgAccuracy * 100) / 100,
      avgWpm: Math.round(avgWpm * 100) / 100,
      totalTimeSeconds,
      dateTime,
      isCompleted,
    });
  });

  return summaries;
}
