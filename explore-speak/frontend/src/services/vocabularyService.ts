import { 
  VocabularyCard, 
  DueCardsResponse, 
  CardUpdateRequest, 
  CardUpdateResponse,
  VocabularyStats,
  ReviewSession 
} from '../types/srs';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://97w79t3en3.execute-api.us-east-1.amazonaws.com';

class VocabularyService {
  /**
   * Get cards due for review
   */
  async getDueCards(userId: string, language: string): Promise<DueCardsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vocabulary/due?userId=${userId}&language=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch due cards');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting due cards:', error);
      throw error;
    }
  }

  /**
   * Update card after review
   */
  async updateCard(request: CardUpdateRequest): Promise<CardUpdateResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error('Failed to update card');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  }

  /**
   * Add vocabulary cards from quest completion
   */
  async addVocabularyCards(
    userId: string,
    questId: string,
    vocabulary: Array<{ word: string; translation: string; exampleSentence?: string }>,
    language: string
  ): Promise<{ success: boolean; cardsAdded: number; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          questId,
          vocabulary,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add vocabulary cards');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding vocabulary cards:', error);
      throw error;
    }
  }

  /**
   * Get vocabulary statistics
   */
  async getVocabularyStats(userId: string, language: string): Promise<VocabularyStats> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/vocabulary/stats?userId=${userId}&language=${language}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting vocabulary stats:', error);
      throw error;
    }
  }

  /**
   * Start a review session
   */
  async startReviewSession(userId: string, language: string): Promise<{ success: boolean; sessionId: string; session: ReviewSession }> {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/session/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start review session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error starting review session:', error);
      throw error;
    }
  }

  /**
   * Complete a review session
   */
  async completeReviewSession(
    sessionId: string,
    userId: string,
    stats: {
      cardsReviewed: number;
      cardsCorrect: number;
      cardsIncorrect: number;
      averageResponseTime: number;
      sessionDuration: number;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/session/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          userId,
          stats,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete review session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error completing review session:', error);
      throw error;
    }
  }
}

export default new VocabularyService();