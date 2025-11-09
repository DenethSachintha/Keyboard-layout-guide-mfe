export interface Tutorial {
  tutorialId: number;
  title: string;
  description: string;
  imageUrl: string;
  estimatedTime: string;
  preRequiredAccuracy: number;
  preRequiredWPM: number;
  preRequiredTrainingTime: string;
  difficulty: string;
  completed: boolean;
  completedModules: any[];
  activeSessionId: string | null;
}
