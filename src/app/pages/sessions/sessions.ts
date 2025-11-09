// this is for hadleling session details
// here we show typical session data
// session means a single practice attempt of a module
// we need to show list of sessions for a module
// these sessions are linked to modules
// module is linked to tutorial
// hardcode some sample sessions data here
// use primeng components similar to modules pages
// no buttons for navigation needed here
// session has following details:
// - session id
// - module id  
// - acccuracy
// - wpm
// - time taken
// - date time
// - completed (boolean)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports'; // assuming you have a central ImportsModule

@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './sessions.html',
  styleUrls: ['./sessions.scss']
})
export class Sessions {
  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];

  sessions = [
    {
      sessionId: 1,
      moduleId: 101,
      accuracy: 85,
      wpm: 42,
      timeTaken: '5m 30s',
      dateTime: '2025-11-07 10:15 AM',
      completed: true
    },
    {
      sessionId: 2,
      moduleId: 101,
      accuracy: 78,
      wpm: 38,
      timeTaken: '6m 10s',
      dateTime: '2025-11-07 12:20 PM',
      completed: false
    },
    {
      sessionId: 3,
      moduleId: 102,
      accuracy: 90,
      wpm: 50,
      timeTaken: '4m 45s',
      dateTime: '2025-11-08 09:05 AM',
      completed: true
    }
  ];

  getSeverity(session: any) {
    return session.completed ? 'success' : 'warn';
  }
}
