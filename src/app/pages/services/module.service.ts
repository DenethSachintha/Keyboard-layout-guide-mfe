import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Module } from '../../models/module';
import { HttpService } from '../../common/services/http.service';



@Injectable({
  providedIn: 'root',
})
export class ModuleService {
  private readonly baseUrl = '/api/modules'; // mock URL

  private modules: Module[] = [
    // --- Tutorial 1 ---
    {
      moduleId: 1,
      tutorialId: 1,
      moduleName: 'Home Row Practice',
      description: 'Master the home row keys (A–L) to build muscle memory.',
      isCompleted: false,
      sentenceArray: ['asdf jkl;', 'fjda lks;'],
      completedTime: null,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 60,
      moduleWiseTargetAccuracy: 70,
      moduleWiseBestAccuracy: 75,
      moduleWiseTargetWPM: 20,
      moduleWiseExpectedWPM: 25,
      moduleWiseBestWPM: 28,
      numberOfSessions: 0,
    },
    {
      moduleId: 2,
      tutorialId: 1,
      moduleName: 'Basic Words',
      description:
        'Practice short common words to improve rhythm and accuracy.',
      isCompleted: false,
      sentenceArray: [
        'the quick brown fox jumps over the lazy dog',
        'hello world this is a typing test',
      ],
      completedTime: null,
      estimatedTime: '15 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 60,
      moduleWiseTargetAccuracy: 70,
      moduleWiseBestAccuracy: 80,
      moduleWiseTargetWPM: 20,
      moduleWiseExpectedWPM: 25,
      moduleWiseBestWPM: 30,
      numberOfSessions: 0,
    },
    // --- Tutorial 2 ---
    {
      moduleId: 3,
      tutorialId: 2,
      moduleName: 'Accuracy Drills',
      description:
        'Focus on hitting the correct keys consistently under pressure.',
      isCompleted: false,
      sentenceArray: ['correct typing requires patience', 'accuracy first'],
      completedTime: null,
      estimatedTime: '20 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 75,
      moduleWiseTargetAccuracy: 80,
      moduleWiseBestAccuracy: 85,
      moduleWiseTargetWPM: 30,
      moduleWiseExpectedWPM: 35,
      moduleWiseBestWPM: 40,
      numberOfSessions: 0,
    },
    {
      moduleId: 4,
      tutorialId: 2,
      moduleName: 'Speed Test',
      description: 'Test your speed with timed sessions to improve reaction time.',
      isCompleted: false,
      sentenceArray: ['fast fingers win the race', 'keep your eyes on the text'],
      completedTime: null,
      estimatedTime: '25 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 85,
      moduleWiseTargetAccuracy: 90,
      moduleWiseBestAccuracy: 92,
      moduleWiseTargetWPM: 40,
      moduleWiseExpectedWPM: 45,
      moduleWiseBestWPM: 50,
      numberOfSessions: 0,
    },
    // --- Tutorial 3 ---
    {
      moduleId: 5,
      tutorialId: 3,
      moduleName: 'Typing Marathon',
      description: 'Long text typing to build endurance and stability in speed.',
      isCompleted: false,
      sentenceArray: ['keep typing long passages to train endurance'],
      completedTime: null,
      estimatedTime: '30 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 90,
      moduleWiseTargetAccuracy: 92,
      moduleWiseBestAccuracy: 95,
      moduleWiseTargetWPM: 50,
      moduleWiseExpectedWPM: 55,
      moduleWiseBestWPM: 60,
      numberOfSessions: 0,
    },
    {
      moduleId: 6,
      tutorialId: 3,
      moduleName: 'Layout Switching',
      description: 'Train on multiple layouts to reach advanced adaptability.',
      isCompleted: false,
      sentenceArray: ['switch between layouts to improve adaptability'],
      completedTime: null,
      estimatedTime: '30 mins',
      imageUrl: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg',
      isActive: false,
      moduleWiseRequiredAccuracy: 95,
      moduleWiseTargetAccuracy: 97,
      moduleWiseBestAccuracy: 98,
      moduleWiseTargetWPM: 60,
      moduleWiseExpectedWPM: 65,
      moduleWiseBestWPM: 70,
      numberOfSessions: 0,
    },
  ];

  constructor(private http: HttpService) {}

  getModules(): Observable<Module[]> {
    return this.http.get<Module[]>(this.baseUrl, this.modules);
  }

  getModulesByTutorialId(tutorialId: number): Observable<Module[]> {
    const result = this.modules.filter((m) => m.tutorialId === tutorialId);
    return this.http.get<Module[]>(`${this.baseUrl}?tutorialId=${tutorialId}`, result);
  }
}
