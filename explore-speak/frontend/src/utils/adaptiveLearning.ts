// Adaptive Learning Algorithm Utilities

import { 
  LearnerProfile, 
  QuestRecommendation, 
  PerformanceMetrics,
  WeaknessAnalysis,
  StrengthAnalysis,
  DifficultyAdjustment 
} from '../types/adaptive';
import { Quest } from '../types/quest';

/**
 * Calculate optimal challenge level based on Zone of Proximal Development (ZPD)
 * Target: 70-80% success rate for optimal learning
 */
export function calculateOptimalChallenge(
  recentScores: number[],
  currentDifficulty: number
): number {
  if (recentScores.length === 0) return currentDifficulty;
  
  const averageScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  // Too easy - increase difficulty
  if (averageScore > 85) {
    return Math.min(currentDifficulty + 1, 10);
  }
  
  // Too hard - decrease difficulty
  if (averageScore < 65) {
    return Math.max(currentDifficulty - 1, 1);
  }
  
  // Just right - maintain current difficulty
  return currentDifficulty;
}

/**
 * Score a quest for recommendation based on user profile
 */
export function scoreQuestRelevance(
  quest: Quest,
  profile: LearnerProfile,
  completedQuestIds: string[]
): number {
  let score = 0;
  
  // Skip if already completed
  if (completedQuestIds.includes(quest.questId)) {
    return 0;
  }
  
  // 1. Difficulty Match (40% weight)
  const questDifficulty = getLevelDifficulty(quest.level);
  const difficultyMatch = 1 - Math.abs(questDifficulty - profile.currentDifficulty) / 10;
  score += difficultyMatch * 40;
  
  // 2. Weakness Targeting (30% weight)
  // Check if quest topics address user's weak areas
  const questTopics = extractQuestTopics(quest);
  const addressesWeakness = questTopics.some(topic => 
    profile.weaknessAreas.includes(topic)
  );
  if (addressesWeakness) {
    score += 30;
  }
  
  // 3. Interest Alignment (20% weight)
  // Check if quest matches user's cultural interests
  const culturalContext = quest.content.preQuest.culturalContext.toLowerCase();
  const matchesInterest = profile.culturalInterests.some(interest =>
    culturalContext.includes(interest.toLowerCase())
  );
  if (matchesInterest) {
    score += 20;
  }
  
  // 4. Language Match (10% weight)
  if (quest.language === profile.language) {
    score += 10;
  }
  
  return Math.round(score);
}

/**
 * Estimate success rate for a quest based on user profile
 */
export function estimateSuccessRate(
  quest: Quest,
  profile: LearnerProfile,
  similarQuestScores: number[]
): number {
  if (similarQuestScores.length === 0) {
    // No history - use difficulty match
    const questDifficulty = getLevelDifficulty(quest.level);
    const difficultyMatch = 1 - Math.abs(questDifficulty - profile.currentDifficulty) / 10;
    return Math.round(difficultyMatch * 100);
  }
  
  // Use historical performance on similar quests
  const averageScore = similarQuestScores.reduce((a, b) => a + b, 0) / similarQuestScores.length;
  return Math.round(averageScore);
}

/**
 * Analyze user's weak areas
 */
export function analyzeWeaknesses(
  performanceHistory: PerformanceMetrics[]
): WeaknessAnalysis['weakTopics'] {
  const topicScores: Record<string, { scores: number[]; attempts: number; lastPracticed: string }> = {};
  
  performanceHistory.forEach(metric => {
    metric.topicscovered.forEach(topic => {
      if (!topicScores[topic]) {
        topicScores[topic] = { scores: [], attempts: 0, lastPracticed: metric.completedAt };
      }
      topicScores[topic].scores.push(metric.score);
      topicScores[topic].attempts++;
      
      // Update last practiced if more recent
      if (new Date(metric.completedAt) > new Date(topicScores[topic].lastPracticed)) {
        topicScores[topic].lastPracticed = metric.completedAt;
      }
    });
  });
  
  // Identify weak topics (average score < 70)
  const weakTopics = Object.entries(topicScores)
    .filter(([_, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return avgScore < 70;
    })
    .map(([topic, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return {
        topic,
        masteryLevel: Math.round(avgScore),
        questsAttempted: data.attempts,
        averageScore: Math.round(avgScore),
        lastPracticed: data.lastPracticed,
        recommendedPractice: generatePracticeRecommendations(topic, avgScore),
      };
    })
    .sort((a, b) => a.averageScore - b.averageScore); // Sort by weakest first
  
  return weakTopics;
}

/**
 * Analyze user's strong areas
 */
export function analyzeStrengths(
  performanceHistory: PerformanceMetrics[]
): StrengthAnalysis['strongTopics'] {
  const topicScores: Record<string, { scores: number[]; attempts: number }> = {};
  
  performanceHistory.forEach(metric => {
    metric.topicscovered.forEach(topic => {
      if (!topicScores[topic]) {
        topicScores[topic] = { scores: [], attempts: 0 };
      }
      topicScores[topic].scores.push(metric.score);
      topicScores[topic].attempts++;
    });
  });
  
  // Identify strong topics (average score >= 85)
  const strongTopics = Object.entries(topicScores)
    .filter(([_, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return avgScore >= 85 && data.attempts >= 2; // At least 2 attempts
    })
    .map(([topic, data]) => {
      const avgScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      const consistency = calculateConsistency(data.scores);
      return {
        topic,
        masteryLevel: Math.round(avgScore),
        questsCompleted: data.attempts,
        averageScore: Math.round(avgScore),
        consistencyRating: consistency,
      };
    })
    .sort((a, b) => b.averageScore - a.averageScore); // Sort by strongest first
  
  return strongTopics;
}

/**
 * Determine if difficulty adjustment is needed
 */
export function shouldAdjustDifficulty(
  recentScores: number[],
  currentDifficulty: number
): DifficultyAdjustment | null {
  if (recentScores.length < 3) return null; // Need at least 3 attempts
  
  const averageScore = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
  
  // User struggling (< 60% success)
  if (averageScore < 60) {
    return {
      originalDifficulty: currentDifficulty,
      adjustedDifficulty: Math.max(currentDifficulty - 1, 1),
      adjustmentReason: 'Reducing difficulty to maintain engagement and prevent frustration',
      modifications: [
        'Provide more hints',
        'Simplify vocabulary',
        'Add more examples',
        'Reduce time pressure',
      ],
      expectedSuccessRate: 75,
    };
  }
  
  // User excelling (> 90% success)
  if (averageScore > 90) {
    return {
      originalDifficulty: currentDifficulty,
      adjustedDifficulty: Math.min(currentDifficulty + 1, 10),
      adjustmentReason: 'Increasing challenge to maintain growth and prevent boredom',
      modifications: [
        'Reduce hints',
        'Add complex vocabulary',
        'Introduce advanced grammar',
        'Add time constraints',
      ],
      expectedSuccessRate: 75,
    };
  }
  
  return null; // No adjustment needed
}

/**
 * Detect learning patterns from session data
 */
export function detectLearningPatterns(sessions: Array<{
  startTime: string;
  duration: number;
  score: number;
}>): {
  peakPerformanceTime: string;
  optimalSessionLength: number;
  averageScore: number;
} {
  if (sessions.length === 0) {
    return {
      peakPerformanceTime: 'morning',
      optimalSessionLength: 20,
      averageScore: 0,
    };
  }
  
  // Analyze performance by time of day
  const timeScores: Record<string, number[]> = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };
  
  sessions.forEach(session => {
    const hour = new Date(session.startTime).getHours();
    let timeOfDay: string;
    
    if (hour >= 6 && hour < 12) timeOfDay = 'morning';
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';
    
    timeScores[timeOfDay].push(session.score);
  });
  
  // Find peak performance time
  let peakTime = 'morning';
  let highestAvg = 0;
  
  Object.entries(timeScores).forEach(([time, scores]) => {
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > highestAvg) {
        highestAvg = avg;
        peakTime = time;
      }
    }
  });
  
  // Calculate optimal session length
  const durations = sessions.map(s => s.duration);
  const optimalLength = Math.round(
    durations.reduce((a, b) => a + b, 0) / durations.length
  );
  
  // Calculate average score
  const averageScore = Math.round(
    sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length
  );
  
  return {
    peakPerformanceTime: peakTime,
    optimalSessionLength: Math.min(Math.max(optimalLength, 10), 45), // Cap between 10-45 min
    averageScore,
  };
}

/**
 * Generate personalized daily goal
 */
export function generateDailyGoal(profile: LearnerProfile): {
  goalType: 'xp' | 'quests' | 'vocabulary' | 'time';
  target: number;
  description: string;
} {
  const dayOfWeek = new Date().getDay();
  
  // Vary goals by day of week
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    // Weekend - focus on vocabulary review
    return {
      goalType: 'vocabulary',
      target: 20,
      description: 'Review 20 vocabulary cards',
    };
  } else if (profile.streakDays > 0 && profile.streakDays % 7 === 0) {
    // Streak milestone - challenge with XP
    return {
      goalType: 'xp',
      target: 500,
      description: 'Earn 500 XP to celebrate your streak!',
    };
  } else if (profile.weaknessAreas.length > 0) {
    // Has weaknesses - focus on practice
    return {
      goalType: 'quests',
      target: 2,
      description: `Complete 2 quests focusing on ${profile.weaknessAreas[0]}`,
    };
  } else {
    // Default - study time
    return {
      goalType: 'time',
      target: profile.averageSessionLength || 20,
      description: `Study for ${profile.averageSessionLength || 20} minutes`,
    };
  }
}

// Helper functions

function getLevelDifficulty(level: string): number {
  const levelMap: Record<string, number> = {
    'A1': 1,
    'A2': 3,
    'B1': 5,
    'B2': 7,
    'C1': 9,
    'C2': 10,
  };
  return levelMap[level] || 5;
}

function extractQuestTopics(quest: Quest): string[] {
  // Extract topics from learning objectives
  const objectives = quest.content.preQuest.learningObjectives;
  const topics: string[] = [];
  
  objectives.forEach(obj => {
    const lower = obj.toLowerCase();
    if (lower.includes('greeting')) topics.push('greetings');
    if (lower.includes('order')) topics.push('ordering');
    if (lower.includes('direction')) topics.push('directions');
    if (lower.includes('conversation')) topics.push('conversation');
    if (lower.includes('grammar')) topics.push('grammar');
    if (lower.includes('vocabulary')) topics.push('vocabulary');
  });
  
  return [...new Set(topics)]; // Remove duplicates
}

function generatePracticeRecommendations(topic: string, score: number): string[] {
  const recommendations: string[] = [];
  
  if (score < 50) {
    recommendations.push('Review basic concepts');
    recommendations.push('Practice with easier quests');
    recommendations.push('Use more hints');
  } else if (score < 70) {
    recommendations.push('Focus on this topic in upcoming quests');
    recommendations.push('Review vocabulary related to this topic');
    recommendations.push('Practice daily for consistency');
  }
  
  return recommendations;
}

function calculateConsistency(scores: number[]): number {
  if (scores.length < 2) return 100;
  
  // Calculate standard deviation
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  // Convert to consistency rating (lower stdDev = higher consistency)
  // Max stdDev of 30 = 0% consistency, 0 stdDev = 100% consistency
  const consistency = Math.max(0, 100 - (stdDev / 30) * 100);
  
  return Math.round(consistency);
}