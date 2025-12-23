import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type {
  Quest,
  QuestListItem,
  UserQuestProgress,
  ExerciseSubmission,
  ExerciseResult,
  QuestStartResponse,
  QuestCompleteResponse,
} from '../types/quest';

/**
 * Quest Service
 * Handles all API calls related to quests
 */

/**
 * Get all available quests
 */
export const getAllQuests = async (userId?: string): Promise<QuestListItem[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // The backend requires guideId, so we fetch quests for all known guides
    const guides = ['pierre', 'sofia', 'marco', 'sakura'];
    
    const questPromises = guides.map(async (guideId) => {
      try {
        const response = await axios.get<{ quests: QuestListItem[] }>(
          `${API_BASE_URL}${API_ENDPOINTS.QUESTS}?userId=${userId}&guideId=${guideId}`
        );
        return response.data.quests || [];
      } catch (error) {
        console.warn(`Failed to fetch quests for guide ${guideId}:`, error);
        return [];
      }
    });

    const questArrays = await Promise.all(questPromises);
    const allQuests = questArrays.flat();
    
    return allQuests;
  } catch (error) {
    console.error('Error fetching quests:', error);
    throw new Error('Failed to load quests. Please try again.');
  }
};

/**
 * Get detailed information about a specific quest
 */
export const getQuestById = async (questId: string): Promise<Quest> => {
  try {
    const response = await axios.get<Quest>(
      `${API_BASE_URL}${API_ENDPOINTS.QUEST_DETAIL(questId)}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching quest ${questId}:`, error);
    throw new Error('Failed to load quest details. Please try again.');
  }
};

/**
 * Start a quest for the current user
 */
export const startQuest = async (
  questId: string,
  userId: string
): Promise<QuestStartResponse> => {
  try {
    const response = await axios.post<QuestStartResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.QUEST_START(questId)}`,
      { userId }
    );
    return response.data;
  } catch (error) {
    console.error(`Error starting quest ${questId}:`, error);
    throw new Error('Failed to start quest. Please try again.');
  }
};

/**
 * Submit an exercise answer
 */
export const submitExercise = async (
  submission: ExerciseSubmission
): Promise<ExerciseResult> => {
  try {
    const response = await axios.post<ExerciseResult>(
      `${API_BASE_URL}${API_ENDPOINTS.QUEST_SUBMIT(submission.questId)}`,
      {
        stepId: submission.stepId,
        userResponse: submission.userResponse,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error submitting exercise:', error);
    throw new Error('Failed to submit answer. Please try again.');
  }
};

/**
 * Complete a quest
 */
export const completeQuest = async (
  questId: string,
  userId: string,
  score: number
): Promise<QuestCompleteResponse> => {
  try {
    const response = await axios.post<QuestCompleteResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.QUEST_COMPLETE(questId)}`,
      {
        userId,
        score,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error completing quest ${questId}:`, error);
    throw new Error('Failed to complete quest. Please try again.');
  }
};

/**
 * Get user's progress for a specific quest
 */
export const getQuestProgress = async (
  questId: string,
  userId: string
): Promise<UserQuestProgress | null> => {
  try {
    // This endpoint might not exist yet - we'll implement it later if needed
    const response = await axios.get<UserQuestProgress>(
      `${API_BASE_URL}/quests/${questId}/progress/${userId}`
    );
    return response.data;
  } catch (error) {
    // Return null if no progress found (quest not started)
    console.log('No progress found for quest:', questId);
    return null;
  }
};
