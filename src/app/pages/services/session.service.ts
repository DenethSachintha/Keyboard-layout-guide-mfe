import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../common/services/http.service';
import { SessionRecord } from '../../models/session-record ';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly baseUrl = '/api/sessions'; // mock URL

  private sessions: SessionRecord[] = [
    // Example pre-existing sessions
    {
      sessionId: 1,
      moduleId: 1,
      stepIndex: 0,
      accuracy: 0,
      wpm: 0,
      sentence: 'asdf jkl;',
      stepTimeSeconds: 30,
      dateTime: '2025-11-09T08:00:00Z',
      isCompleted: false,
    },
    {
      sessionId: 2,
      moduleId: 1,
      stepIndex: 1,
      accuracy: 70,
      wpm: 20,
      sentence: 'fjda lks;',
      stepTimeSeconds: 45,
      dateTime: '2025-11-09T08:05:00Z',
      isCompleted: true,
    },
  ];

  constructor(private http: HttpService) {}

  /** ✅ Get all sessions */
  getSessions(): Observable<SessionRecord[]> {
    return this.http.get<SessionRecord[]>(this.baseUrl, this.sessions);
  }

  /** ✅ Get sessions by moduleId */
  getSessionsByModuleId(moduleId: number): Observable<SessionRecord[]> {
    const result = this.sessions.filter((s) => s.moduleId === moduleId);
    return this.http.get<SessionRecord[]>(`${this.baseUrl}?moduleId=${moduleId}`, result);
  }

  /** ✅ Get session by ID */
  getSessionById(sessionId: number): Observable<SessionRecord | undefined> {
    const session = this.sessions.find((s) => s.sessionId === sessionId);
    return this.http.get<SessionRecord | undefined>(`${this.baseUrl}/${sessionId}`, session);
  }

  /** ✅ Mocked POST request to store new session step */
  addSessionStep(newSession: SessionRecord): Observable<SessionRecord> {
    // Generate unique sessionId
    const maxId = this.sessions.length > 0 ? Math.max(...this.sessions.map(s => s.sessionId)) : 0;
    newSession.sessionId = maxId + 1;

    // Push into hardcoded array
    this.sessions.push(newSession);
    console.log('Saved new session step:', newSession);

    // Return as observable (simulate HTTP POST)
    return this.http.post<SessionRecord>(this.baseUrl, newSession);
  }
}
