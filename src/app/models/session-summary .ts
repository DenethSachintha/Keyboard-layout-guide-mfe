export interface SessionSummary {
  sessionId: number;
  moduleId: number;
  avgAccuracy: number;
  avgWpm: number;
  totalTimeSeconds: number;
  dateTime: string;
  isCompleted: boolean;
}
