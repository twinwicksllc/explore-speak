// Spaced Repetition System (SRS) TypeScript types

export interface VocabularyCard {
  userId: string;
  cardId: string;
  wordId: string;
  word: string;
  translation: string;
  language: string;
  
  // SRS Fields (SM-2 Algorithm)
  easeFactor: number;        // 2.5 default (SM-2 algorithm)
  interval: number;          // Days until next review
  repetitions: number;       // Number of successful reviews
  nextReviewDate: string;    // ISO timestamp
  lastReviewDate: string;    // ISO timestamp
  
  // Performance Tracking
  correctCount: number;
  incorrectCount: number;
  averageResponseTime: number; // milliseconds
  
  // Context
  sourceQuestId: string;
  exampleSentence: string;
  difficulty: 'easy' | 'medium' | 'hard';
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSession {
  sessionId: string;
  userId: string;
  language: string;
  startedAt: string;
  completedAt?: string;
  cardsReviewed: number;
  cardsCorrect: number;
  cardsIncorrect: number;
  averageResponseTime: number;
  sessionDuration: number; // seconds
}

export interface ReviewResponse {
  cardId: string;
  quality: 1 | 2 | 3 | 4 | 5; // SM-2 quality rating
  responseTime: number; // milliseconds
  timestamp: string;
}

export interface VocabularyStats {
  userId: string;
  language: string;
  totalCards: number;
  masteredCards: number; // repetitions >= 5
  learningCards: number; // repetitions 1-4
  newCards: number; // repetitions 0
  dueToday: number;
  reviewedToday: number;
  currentStreak: number;
  longestStreak: number;
  totalReviewTime: number; // minutes
  averageRetention: number; // percentage
}

export interface DueCardsResponse {
  cards: VocabularyCard[];
  totalDue: number;
  newCards: number;
  reviewCards: number;
}

export interface CardUpdateRequest {
  cardId: string;
  quality: 1 | 2 | 3 | 4 | 5;
  responseTime: number;
}

export interface CardUpdateResponse {
  success: boolean;
  updatedCard: VocabularyCard;
  nextReviewDate: string;
  message: string;
}

// SM-2 Algorithm calculation result
export interface SM2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewDate: string;
}