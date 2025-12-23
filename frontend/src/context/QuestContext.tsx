import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Quest, QuestListItem, UserQuestProgress } from '../types/quest';
import * as questService from '../services/questService';

interface QuestContextType {
  quests: QuestListItem[];
  currentQuest: Quest | null;
  questProgress: UserQuestProgress | null;
  loading: boolean;
  error: string | null;
  fetchQuests: () => Promise<void>;
  fetchQuestById: (questId: string) => Promise<void>;
  startQuest: (questId: string, userId: string) => Promise<void>;
  clearCurrentQuest: () => void;
  setError: (error: string | null) => void;
}

const QuestContext = createContext<QuestContextType | null>(null);

export const useQuest = (): QuestContextType => {
  const context = useContext(QuestContext);
  if (!context) {
    throw new Error('useQuest must be used within a QuestProvider');
  }
  return context;
};

interface QuestProviderProps {
  children: ReactNode;
}

export const QuestProvider: React.FC<QuestProviderProps> = ({ children }) => {
  const [quests, setQuests] = useState<QuestListItem[]>([]);
  const [currentQuest, setCurrentQuest] = useState<Quest | null>(null);
  const [questProgress, setQuestProgress] = useState<UserQuestProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all available quests
   */
  const fetchQuests = useCallback(async (userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const questList = await questService.getAllQuests(userId);
      setQuests(questList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quests';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch a specific quest by ID
   */
  const fetchQuestById = useCallback(async (questId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const quest = await questService.getQuestById(questId, userId);
      setCurrentQuest(quest);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load quest';
      setError(errorMessage);
      setCurrentQuest(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Start a quest
   */
  const startQuest = useCallback(async (questId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await questService.startQuest(questId, userId);
      setQuestProgress(response.progress);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start quest';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear current quest (for navigation away)
   */
  const clearCurrentQuest = useCallback(() => {
    setCurrentQuest(null);
    setQuestProgress(null);
    setError(null);
  }, []);

  const value: QuestContextType = {
    quests,
    currentQuest,
    questProgress,
    loading,
    error,
    fetchQuests,
    fetchQuestById,
    startQuest,
    clearCurrentQuest,
    setError,
  };

  return <QuestContext.Provider value={value}>{children}</QuestContext.Provider>;
};
