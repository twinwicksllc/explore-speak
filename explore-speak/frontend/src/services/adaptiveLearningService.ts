import { 
  LearnerProfile, 
  QuestRecommendation, 
  PerformanceMetrics,
  DailyGoal,
  RecommendationRequest,
  RecommendationResponse 
} from '../types/adaptive';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://97w79t3en3.execute-api.us-east-1.amazonaws.com';

class AdaptiveLearningService {
  /**
   * Get learner profile
   */
  async getLearnerProfile(userId: string, language: string): Promise<LearnerProfile> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adaptive/profile?userId=${userId}&language=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch learner profile');
      }

      const data = await response.json();
      return data.profile;
    } catch (error) {
      console.error('Error getting learner profile:', error);
      throw error;
    }
  }

  /**
   * Update learner profile after quest completion
   */
  async updateLearnerProfile(
    userId: string,
    language: string,
    questId: string,
    score: number,
    timeSpent: number
  ): Promise<{ success: boolean; profile: LearnerProfile }> {
    try {
      const response = await fetch(`${API_BASE_URL}/adaptive/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          language,
          questId,
          score,
          timeSpent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update learner profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating learner profile:', error);
      throw error;
    }
  }

  /**
   * Save performance metrics
   */
  async savePerformanceMetrics(
    userId: string,
    questId: string,
    metrics: {
      score: number;
      timeSpent: number;
      attemptsCount?: number;
      hintsUsed?: number;
      difficulty?: number;
      topics?: string[];
    }
  ): Promise<{ success: boolean; performanceId: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/adaptive/performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          questId,
          metrics,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save performance metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving performance metrics:', error);
      throw error;
    }
  }

  /**
   * Get personalized quest recommendations
   */
  async getPersonalizedQuests(
    userId: string,
    language: string,
    limit: number = 5
  ): Promise<QuestRecommendation[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adaptive/recommendations?userId=${userId}&language=${language}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch quest recommendations');
      }

      const data = await response.json();
      return data.recommendations;
    } catch (error) {
      console.error('Error getting quest recommendations:', error);
      throw error;
    }
  }

  /**
   * Get daily goal
   */
  async getDailyGoal(userId: string, language: string): Promise<DailyGoal> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adaptive/goal/daily?userId=${userId}&language=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch daily goal');
      }

      const data = await response.json();
      return data.goal;
    } catch (error) {
      console.error('Error getting daily goal:', error);
      throw error;
    }
  }

  /**
   * Get performance history
   */
  async getPerformanceHistory(
    userId: string,
    language: string,
    limit: number = 20
  ): Promise<PerformanceMetrics[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/adaptive/performance/history?userId=${userId}&language=${language}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch performance history');
      }

      const data = await response.json();
      return data.history;
    } catch (error) {
      console.error('Error getting performance history:', error);
      throw error;
    }
  }
}

export default new AdaptiveLearningService();