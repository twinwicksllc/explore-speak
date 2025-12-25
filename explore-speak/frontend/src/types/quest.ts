// Quest-related TypeScript types

export interface VocabularyItem {
  word: string;
  translation: string;
}

export interface DialogueStep {
  stepId: number;
  speaker: 'guide' | 'user_prompt' | 'user';
  message?: string;
  userPrompt?: string;
  acceptableResponses?: string[];
  hint?: string;
}

export interface Exercise {
  type: 'dialogue';
  steps: DialogueStep[];
}

export interface VocabularyReview {
  type: 'matching';
  items: VocabularyItem[];
}

export interface GrammarCheckItem {
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface QuestRewards {
  baseXP: number;
  perfectXP: number;
  achievement: string;
  photo: {
    url: string;
    caption: string;
  };
}

export interface QuestAssessment {
  passingScore: number;
  rewards: QuestRewards;
}

export interface PreQuest {
  culturalContext: string;
  learningObjectives: string[];
  keyVocabulary: VocabularyItem[];
}

export interface PostQuest {
  summaryMessage: string;
  vocabularyReview: VocabularyReview;
  grammarCheck: GrammarCheckItem[];
  assessment: QuestAssessment;
}

export interface QuestContent {
  preQuest: PreQuest;
  exercises: {
    mainDialogue: Exercise;
  };
  postQuest: PostQuest;
}

export interface Quest {
  questId: string;
  title: string;
  language: string;
  level: string; // A1, A2, B1, etc.
  guideId: string;
  estimatedTime: number; // in minutes
  content: QuestContent;
  createdAt: string;
  updatedAt: string;
}

export interface QuestListItem {
  questId: string;
  title: string;
  language: string;
  level: string;
  estimatedTime: number;
  guideId: string;
}

export interface UserQuestProgress {
  userId: string;
  questId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  currentStep?: number;
  score?: number;
  xpEarned?: number;
  completedAt?: string;
  startedAt?: string;
}

export interface ExerciseSubmission {
  questId: string;
  stepId: number;
  userResponse: string;
}

export interface ExerciseResult {
  correct: boolean;
  feedback: string;
  acceptableAnswer?: string;
}

export interface QuestStartResponse {
  success: boolean;
  message: string;
  progress: UserQuestProgress;
}

export interface QuestCompleteResponse {
  success: boolean;
  message: string;
  xpEarned: number;
  achievement?: string;
  newLevel?: number;
}
