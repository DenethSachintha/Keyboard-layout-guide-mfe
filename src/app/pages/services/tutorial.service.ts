import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../../common/services/http.service';
import { Tutorial } from '../../models/tutorial';


@Injectable({
  providedIn: 'root',
})
export class TutorialService {
  private readonly baseUrl = '/api/tutorials'; // Mock URL

  private tutorials: Tutorial[] = [
    {
      tutorialId: 1,
      title: 'Typing Basics',
      description:
        'Learn the fundamentals of touch typing, proper finger placement, and posture. Perfect for complete beginners.',
      imageUrl:
        'https://cdn.pixabay.com/photo/2016/11/29/06/15/keyboard-1869306_1280.jpg',
      estimatedTime: '30 mins',
      preRequiredAccuracy: 0,
      preRequiredWPM: 0,
      preRequiredTrainingTime: 'None',
      difficulty: 'Beginner',
      completed: false,
      completedModules: [],
      activeSessionId: null,
    },
    {
      tutorialId: 2,
      title: 'Speed & Precision',
      description:
        'Improve typing accuracy and speed with structured exercises focusing on common mistakes and rhythm building.',
      imageUrl:
        'https://cdn.pixabay.com/photo/2016/01/19/17/32/keyboard-1149148_1280.jpg',
      estimatedTime: '45 mins',
      preRequiredAccuracy: 80,
      preRequiredWPM: 35,
      preRequiredTrainingTime: '1 hour',
      difficulty: 'Intermediate',
      completed: false,
      completedModules: [],
      activeSessionId: null,
    },
    {
      tutorialId: 3,
      title: 'Master Typist',
      description:
        'Advanced lessons for achieving professional-level typing speed and consistency across different layouts.',
      imageUrl:
        'https://cdn.pixabay.com/photo/2015/01/08/18/26/startup-593327_1280.jpg',
      estimatedTime: '1 hour',
      preRequiredAccuracy: 90,
      preRequiredWPM: 55,
      preRequiredTrainingTime: '2+ hours',
      difficulty: 'Advanced',
      completed: false,
      completedModules: [],
      activeSessionId: null,
    },
  ];

  constructor(private http: HttpService) {}

  // Simulate GET /api/tutorials
  getTutorials(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(this.baseUrl, this.tutorials);
  }

  // Simulate GET /api/tutorials/:id
  getTutorialById(id: number): Observable<Tutorial | undefined> {
    const tutorial = this.tutorials.find((t) => t.tutorialId === id);
    return this.http.get<Tutorial | undefined>(`${this.baseUrl}/${id}`, tutorial);
  }
}
