// Adaptive Learning System TypeScript types

export interface LearnerProfile {
  userId: string;
  language: string;
  
  // Performance Metrics
  overallLevel: string; // A1, A2, B1, B2, C1, C2
  levelProgress: number; // 0-100 percentage to next level
  vocabularySize: number;
  grammarMastery: Record<string, number>; // topic -> mastery %
  
  // Learning Patterns
  averageSessionLength: number; // minutes
  preferredTimeOfDay: string; // 'morning' | 'afternoon' | 'evening' | 'night'
  learningPace: 'slow' | 'moderate' | 'fast';
  strengthAreas: string[]; // Topics user excels at
  weaknessAreas: string[]; // Topics needing improvement
  
  // Engagement Metrics
  streakDays: number;
  totalStudyTime: number; // minutes
  completionRate: number; // % of started quests completed
  lastActiveDate: string;
  
  // Adaptive Parameters
  currentDifficulty: number; // 1-10 scale
  optimalChallengeLevel: number; // Calculated ZPD (Zone of Proximal Development)
  frustrationThreshold: number; // When to ease difficulty
  boredomThreshold: number; // When to increase difficulty
  
  // Content Preferences
  favoriteQuestTypes: string[];
  preferredExerciseTypes: string[];
  culturalInterests: string[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface QuestRecommendation {
  questId: string;
  title: string;
  language: string;
  level: string;
  relevanceScore: number; // 0-100
  difficulty: number; // 1-10
  estimatedSuccessRate: number; // Based on user profile
  reasoning: string; // Why this quest was recommended
  prerequisites: string[];
  learningObjectives: string[];
  estimatedTime: number; // minutes
  addressesWeakness: boolean;
  matchesInterest: boolean;
}

export interface LearningPattern {
  userId: string;
  language: string;
  peakPerformanceTime: string; // Time of day
  optimalSessionLength: number; // minutes
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  retentionRate: number; // percentage
  progressionRate: number; // quests per week
  preferredDifficulty: number; // 1-10
}

export interface PerformanceMetrics {
  userId: string;
  questId: string;
  score: number; // 0-100
  timeSpent: number; // minutes
  attemptsCount: number;
  hintsUsed: number;
  completedAt: string;
  difficulty: number;
  topicscovered: string[];
}

export interface DailyGoal {
  userId: string;
  date: string;
  goalType: 'xp' | 'quests' | 'vocabulary' | 'time';
  target: number;
  completed: number;
  description: string;
  isComplete: boolean;
}

export interface WeaknessAnalysis {
  userId: string;
  language: string;
  weakTopics: Array<{
    topic: string;
    masteryLevel: number; // 0-100
    questsAttempted: number;
    averageScore: number;
    lastPracticed: string;
    recommendedPractice: string[];
  }>;
  overallWeaknessScore: number; // 0-100
  improvementSuggestions: string[];
}

export interface StrengthAnalysis {
  userId: string;
  language: string;
  strongTopics: Array<{
    topic: string;
    masteryLevel: number; // 0-100
    questsCompleted: number;
    averageScore: number;
    consistencyRating: number; // 0-100
  }>;
  overallStrengthScore: number; // 0-100
}

export interface DifficultyAdjustment {
  originalDifficulty: number;
  adjustedDifficulty: number;
  adjustmentReason: string;
  modifications: string[];
  expectedSuccessRate: number;
}

export interface AdaptiveQuestContent {
  questId: string;
  userId: string;
  originalContent: any;
  modifiedContent: any;
  adjustments: DifficultyAdjustment;
  appliedAt: string;
}

export interface LearningInsight {
  userId: string;
  insightType: 'strength' | 'weakness' | 'pattern' | 'recommendation';
  title: string;
  description: string;
  actionable: boolean;
  actionText?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface StudySession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration: number; // minutes
  questsCompleted: number;
  xpEarned: number;
  vocabularyReviewed: number;
  averageScore: number;
  timeOfDay: string;
}

export interface ProgressTimeline {
  userId: string;
  language: string;
  milestones: Array<{
    date: string;
    type: 'level_up' | 'quest_complete' | 'streak_milestone' | 'mastery_achieved';
    description: string;
    xpEarned?: number;
    newLevel?: string;
  }>;
}

export interface RecommendationRequest {
  userId: string;
  language: string;
  limit?: number;
  includeCompleted?: boolean;
  focusArea?: 'weakness' | 'interest' | 'balanced';
}

export interface RecommendationResponse {
  recommendations: QuestRecommendation[];
  totalAvailable: number;
  userProfile: LearnerProfile;
  insights: LearningInsight[];
}