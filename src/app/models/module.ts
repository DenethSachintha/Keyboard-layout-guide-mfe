export interface Module {
  moduleId: number;
  tutorialId: number;
  moduleName: string;
  description: string;
  isCompleted: boolean;
  sentenceArray: string[];
  completedTime: string | null;
  estimatedTime: string;
  imageUrl: string;
  isActive: boolean;
  moduleWiseRequiredAccuracy: number;
  moduleWiseTargetAccuracy: number;
  moduleWiseBestAccuracy: number;
  moduleWiseTargetWPM: number;
  moduleWiseExpectedWPM: number;
  moduleWiseBestWPM: number;
  numberOfSessions: number;
}