export interface SessionRecord {
  sessionId: number;      // Unique session ID
  moduleId: number;       // ID of the module this session belongs to
  stepIndex: number;      // Step index within the session
  accuracy: number;       // Accuracy percentage for this step
  wpm: number;            // Cumulative WPM after this step
  sentence: string;       // Sentence typed in this step
  stepTimeSeconds: number; // Time spent on this step in seconds
  dateTime: string;       // Date and time of this step
  isCompleted: boolean;   // Step completion status
}
