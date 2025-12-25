// SM-2 Algorithm Implementation for Spaced Repetition
// Based on SuperMemo 2 algorithm by Piotr Wozniak

import { VocabularyCard, SM2Result } from '../types/srs';

/**
 * Calculate next review date using SM-2 algorithm
 * @param card - Current vocabulary card state
 * @param quality - User's response quality (1-5)
 *   1 = Complete blackout
 *   2 = Incorrect response, but correct answer seemed familiar
 *   3 = Incorrect response, but correct answer remembered
 *   4 = Correct response, with hesitation
 *   5 = Perfect response
 * @returns Updated card parameters
 */
export function calculateNextReview(
  card: VocabularyCard,
  quality: 1 | 2 | 3 | 4 | 5
): SM2Result {
  let { easeFactor, interval, repetitions } = card;

  // Quality < 3 means incorrect response - reset repetitions
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Correct response - calculate new interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor based on quality
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ensure ease factor doesn't go below 1.3
  easeFactor = Math.max(1.3, easeFactor);

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}

/**
 * Determine if a card is due for review
 * @param card - Vocabulary card to check
 * @returns true if card is due for review
 */
export function isCardDue(card: VocabularyCard): boolean {
  const now = new Date();
  const nextReview = new Date(card.nextReviewDate);
  return now >= nextReview;
}

/**
 * Get card status based on repetitions
 * @param repetitions - Number of successful reviews
 * @returns Card status
 */
export function getCardStatus(repetitions: number): 'new' | 'learning' | 'mastered' {
  if (repetitions === 0) return 'new';
  if (repetitions < 5) return 'learning';
  return 'mastered';
}

/**
 * Calculate retention rate for a set of cards
 * @param cards - Array of vocabulary cards
 * @returns Retention percentage (0-100)
 */
export function calculateRetentionRate(cards: VocabularyCard[]): number {
  if (cards.length === 0) return 0;
  
  const totalAttempts = cards.reduce(
    (sum, card) => sum + card.correctCount + card.incorrectCount,
    0
  );
  
  if (totalAttempts === 0) return 0;
  
  const totalCorrect = cards.reduce((sum, card) => sum + card.correctCount, 0);
  
  return Math.round((totalCorrect / totalAttempts) * 100);
}

/**
 * Get recommended daily review count
 * @param totalCards - Total number of cards in deck
 * @param dueCards - Number of cards due today
 * @returns Recommended number of cards to review
 */
export function getRecommendedReviewCount(
  totalCards: number,
  dueCards: number
): number {
  // Recommend reviewing all due cards, but cap at 50 per day
  const maxDaily = 50;
  const recommended = Math.min(dueCards, maxDaily);
  
  // If user has few cards, recommend at least 10 new cards
  if (totalCards < 20) {
    return Math.max(recommended, 10);
  }
  
  return recommended;
}

/**
 * Calculate study streak
 * @param reviewDates - Array of review dates (ISO strings)
 * @returns Current streak in days
 */
export function calculateStreak(reviewDates: string[]): number {
  if (reviewDates.length === 0) return 0;
  
  // Sort dates in descending order
  const sortedDates = reviewDates
    .map(date => new Date(date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const reviewDate = new Date(sortedDates[i]);
    reviewDate.setHours(0, 0, 0, 0);
    
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    if (reviewDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Estimate time to mastery for a card
 * @param card - Vocabulary card
 * @returns Estimated days until mastery (repetitions >= 5)
 */
export function estimateTimeToMastery(card: VocabularyCard): number {
  const repetitionsNeeded = Math.max(0, 5 - card.repetitions);
  
  if (repetitionsNeeded === 0) return 0;
  
  // Estimate based on current interval and ease factor
  let totalDays = 0;
  let currentInterval = card.interval;
  
  for (let i = 0; i < repetitionsNeeded; i++) {
    totalDays += currentInterval;
    currentInterval = Math.round(currentInterval * card.easeFactor);
  }
  
  return totalDays;
}

/**
 * Get quality rating suggestion based on response time
 * @param responseTime - Time taken to respond in milliseconds
 * @param averageTime - User's average response time
 * @returns Suggested quality rating
 */
export function suggestQualityRating(
  responseTime: number,
  averageTime: number
): 1 | 2 | 3 | 4 | 5 {
  const ratio = responseTime / averageTime;
  
  if (ratio <= 0.5) return 5; // Very fast - perfect recall
  if (ratio <= 1.0) return 4; // Normal speed - good recall
  if (ratio <= 1.5) return 3; // Slower - hesitant recall
  if (ratio <= 2.0) return 2; // Much slower - difficult recall
  return 1; // Very slow - poor recall
}