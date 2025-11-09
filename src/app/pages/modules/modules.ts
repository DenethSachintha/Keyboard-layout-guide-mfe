import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './modules.html',
  styleUrls: ['./modules.scss']
})
export class Modules implements OnInit {
  tutorialId!: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.tutorialId = Number(this.route.snapshot.paramMap.get('id'));
    this.modules = this.modules.filter(m => m.tutorialId === this.tutorialId);
  }


  layout: 'list' | 'grid' = 'list';
  options = ['list', 'grid'];
  

  /** ✅ Start/Continue button → session/:id */
  openSession(id: number) {
  if (!id) {
    console.error('❌ Invalid module id:', id);
    return;
  }
      this.router.navigate(['../../session', id], { relativeTo: this.route });

}


  /** ✅ View Sessions button → modules/:id */
  viewSessions(id: number) {
  if (!id) {
    console.error('❌ Invalid module id:', id);
    return;
  }
  this.router.navigate(['../../sessions', id], { relativeTo: this.route });

}


  /** Optional helper for status styling */
  getSeverity(module: any): any {
    switch (module.status) {
      case 'Active':
        return 'success';
      case 'Available':
        return 'info';
      default:
        return 'warn';
    }
  }
  modules = [
    // --- Tutorial 1 ---
    {
      moduleId: 1,
      tutorialId: 1,
      title: 'Home Row Practice',
      description: 'Master the home row keys (A–L) to build muscle memory.',
      isCompleted: false,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 0,
      moduleWiseRequiredWPM: 0
    },
    {
      moduleId: 2,
      tutorialId: 1,
      title: 'Basic Words',
      description: 'Practice short common words to improve rhythm and accuracy.',
      isCompleted: false,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 60,
      moduleWiseRequiredWPM: 20
    },
    // --- Tutorial 2 ---
    {
      moduleId: 3,
      tutorialId: 2,
      title: 'Accuracy Drills',
      description: 'Focus on hitting the correct keys consistently under pressure.',
      isCompleted: false,
      estimatedTime: '20 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 75,
      moduleWiseRequiredWPM: 30
    },
    {
      moduleId: 4,
      tutorialId: 2,
      title: 'Speed Test',
      description: 'Test your speed with timed sessions to improve reaction time.',
      isCompleted: false,
      estimatedTime: '25 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 85,
      moduleWiseRequiredWPM: 40
    },
    // --- Tutorial 3 ---
    {
      moduleId: 5,
      tutorialId: 3,
      title: 'Typing Marathon',
      description: 'Long text typing to build endurance and stability in speed.',
      isCompleted: false,
      estimatedTime: '30 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 90,
      moduleWiseRequiredWPM: 50
    },
    {
      moduleId: 6,
      tutorialId: 3,
      title: 'Layout Switching',
      description: 'Train on multiple layouts to reach advanced adaptability.',
      isCompleted: false,
      estimatedTime: '30 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 95,
      moduleWiseRequiredWPM: 60
    }
  ];

}

/* 

when user click start tutorial button
it should redirect to modules page

tutorial id will be pass as para from url

modules page get this id and loads relevent modules based on tutorial id

moduels page will have list of modules for that tutorial. Hardcode data for 2 modules for each tutorial.

each module will have following structure:
module id
title
description
is completed (boolean)
estimated time to complete
image url
isActive (boolean)
moduleWiseRequriedAccuraccy
moduleWiseRequriedWPM

*/