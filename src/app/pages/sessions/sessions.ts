// this is for hadleling session details
// here we show typical session data
// session means a single practice attempt of a module
// we need to show list of sessions for a module
// these sessions are linked to modules
// module is linked to tutorial
// hardcode some sample sessions data here
// use primeng components similar to modules pages
// no buttons for navigation needed here


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/session.service';
import { SessionRecord } from '../../models/session-record ';
import { ModuleService } from '../services/module.service';
import { Module } from '../../models/module';
import { SessionSummary } from '../../models/session-summary ';
import { summarizeSessions } from '../../common/utils/session-summary.util';


@Component({
  selector: 'app-sessions',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './sessions.html',
  styleUrls: ['./sessions.scss'],
})
export class Sessions implements OnInit {
  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];

  moduleId!: number;
  sessions: SessionRecord[] = [];
  sessionSummaries: SessionSummary[] = [];
  isLoading = true;
  module?: Module;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
     private moduleService: ModuleService
  ) {}

  ngOnInit(): void {
    this.moduleId = Number(this.route.snapshot.paramMap.get('id'));
     this.loadModuleAndSessions();
  }

  /** ✅ Load sessions for a given module */
   private loadModuleAndSessions(): void {
    this.isLoading = true;

    // Load module
    this.moduleService.getModules().subscribe({
      next: (modules) => {
        this.module = modules.find((m) => m.moduleId === this.moduleId);
        if (!this.module) console.warn('Module not found:', this.moduleId);
      },
      error: (err) => console.error('Failed to load module:', err),
    });

    // Load sessions
    this.sessionService.getSessionsByModuleId(this.moduleId).subscribe({
      next: (sessions) => {
        this.sessions = sessions;
        this.sessionSummaries = summarizeSessions(sessions); // ✅ summarized version
        this.isLoading = false;
        console.log(`✅ Loaded sessions for module ${this.moduleId}:`, this.sessions);
      },
      error: (err) => {
        console.error('Failed to load sessions:', err);
        this.isLoading = false;
      },
    });
  }

  /** ✅ Severity for PrimeNG badges */
  getSeverity(session: SessionRecord): any {
    return session.isCompleted ? 'success' : 'warn';
  }
}
