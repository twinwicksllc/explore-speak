// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://wtu71yyi3m.execute-api.us-east-1.amazonaws.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: '/auth/signup',
  CONFIRM: '/auth/confirm',
  SIGNIN: '/auth/signin',
  REFRESH: '/auth/refresh',
  HEALTH: '/auth/health',
  
  // Quest endpoints (existing)
  QUESTS: '/quests',
  QUEST_DETAIL: (questId) => `/quests/${questId}`,
  QUEST_START: (questId) => `/quests/${questId}/start`,
  QUEST_SUBMIT: (questId) => `/quests/${questId}/submit-exercise`,
  QUEST_COMPLETE: (questId) => `/quests/${questId}/complete`,
  
  // Chat endpoint (existing)
  CHAT: '/chat',
};
