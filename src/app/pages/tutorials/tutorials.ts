/*
Generate UI for tutorials page.
hardcode data for 3 tutorials.
Use primeng components for UI.( cards. etc)
each card should display tutorial title, description, estimated time to complete, difficulty level, image.

there will be 3 tutorials in this section. 1 for beginners, 1 for intermediates, and 1 for advanced users.
each tutorial will have a list of modules to follow.
each tutorial will have following structure:
- tutorial Id
- title
- description
- image url
- list id of modules
- estimated time to complete
- preRequried Accuraccy 
- preRequried WPM
- preRequried Training time
- difficulty level (beginner, intermediate, advanced)
- completed (boolean)
- completed modules (list of module ids)
- active session id

sample code for p-card component from primeng:

*/
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ImportsModule } from '../../imports';

@Component({
  selector: 'app-tutorials',
  standalone: true,
  imports: [CommonModule, ImportsModule],
  templateUrl: './tutorials.html',
  styleUrls: ['./tutorials.scss']
})
export class Tutorials {
  constructor(private router: Router, private route: ActivatedRoute) {}

  tutorials = [
    {
      tutorialId: 1,
      title: 'Typing Basics',
      description: 'Learn the fundamentals of touch typing, proper finger placement, and posture. Perfect for complete beginners.',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/06/15/keyboard-1869306_1280.jpg',
      estimatedTime: '30 mins',
      preRequiredAccuracy: 0,
      preRequiredWPM: 0,
      preRequiredTrainingTime: 'None',
      difficulty: 'Beginner',
      completed: false,
      completedModules: [],
      activeSessionId: null
    },
    {
      tutorialId: 2,
      title: 'Speed & Precision',
      description: 'Improve typing accuracy and speed with structured exercises focusing on common mistakes and rhythm building.',
      imageUrl: 'https://cdn.pixabay.com/photo/2016/01/19/17/32/keyboard-1149148_1280.jpg',
      estimatedTime: '45 mins',
      preRequiredAccuracy: 80,
      preRequiredWPM: 35,
      preRequiredTrainingTime: '1 hour',
      difficulty: 'Intermediate',
      completed: false,
      completedModules: [],
      activeSessionId: null
    },
    {
      tutorialId: 3,
      title: 'Master Typist',
      description: 'Advanced lessons for achieving professional-level typing speed and consistency across different layouts.',
      imageUrl: 'https://cdn.pixabay.com/photo/2015/01/08/18/26/startup-593327_1280.jpg',
      estimatedTime: '1 hour',
      preRequiredAccuracy: 90,
      preRequiredWPM: 55,
      preRequiredTrainingTime: '2+ hours',
      difficulty: 'Advanced',
      completed: false,
      completedModules: [],
      activeSessionId: null
    }
  ];

  viewModules(id: number) {
    // Dynamically navigates to "modules/:id" under current route
    this.router.navigate(['../modules', id], { relativeTo: this.route });
  }
}
