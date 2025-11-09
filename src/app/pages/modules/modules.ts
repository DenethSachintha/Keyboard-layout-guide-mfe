import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';
import { Module } from '../../models/module';
import { ModuleService } from '../services/module.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './modules.html',
  styleUrls: ['./modules.scss'],
})
export class Modules implements OnInit {
  tutorialId!: number;
  modules: Module[] = [];
  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService
  ) {}

  ngOnInit() {
    this.tutorialId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadModules();
  }

  loadModules() {
    this.moduleService
      .getModulesByTutorialId(this.tutorialId)
      .subscribe((data) => (this.modules = data));
  }

  /** ✅ Start/Continue button → session/:id */
  openSession(id: number) {
    if (!id) return console.error('❌ Invalid module id:', id);
    this.router.navigate(['../../session', id], { relativeTo: this.route });
  }

  /** ✅ View Sessions button → sessions/:id */
  viewSessions(id: number) {
    if (!id) return console.error('❌ Invalid module id:', id);
    this.router.navigate(['../../sessions', id], { relativeTo: this.route });
  }

  getSeverity(module: Module): any {
    if (module.isActive) return 'success';
    if (module.isCompleted) return 'info';
    return 'warn';
  }
  getStatus(module: Module): any {
    if (module.isActive) return 'Active';
    if (module.isCompleted) return 'Completed';
    return 'New';
  }
}
