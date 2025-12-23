import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { QuestListItem } from '../../types/quest';
import './QuestCard.css';

interface QuestCardProps {
  quest: QuestListItem;
}

// Language flag emojis
const LANGUAGE_FLAGS: Record<string, string> = {
  french: '🇫🇷',
  portuguese: '🇵🇹',
  italian: '🇮🇹',
  japanese: '🇯🇵',
  spanish: '🇪🇸',
  german: '🇩🇪',
  chinese: '🇨🇳',
  korean: '🇰🇷',
};

// Extract language from questId (e.g., "fr_ordering_coffee_01" -> "french")
const getLanguageFromQuestId = (questId: string): string => {
  const prefix = questId.split('_')[0];
  const languageMap: Record<string, string> = {
    fr: 'french',
    pt: 'portuguese',
    it: 'italian',
    jp: 'japanese',
    es: 'spanish',
    de: 'german',
    zh: 'chinese',
    ko: 'korean',
  };
  return languageMap[prefix] || 'unknown';
};

const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const navigate = useNavigate();
  
  const language = getLanguageFromQuestId(quest.questId);
  const flag = LANGUAGE_FLAGS[language] || '🌍';
  const languageName = language.charAt(0).toUpperCase() + language.slice(1);

  const handleClick = () => {
    navigate(`/quests/${quest.questId}`);
  };

  return (
    <div className="quest-card" onClick={handleClick}>
      <div className="quest-card-header">
        <span className="quest-flag">{flag}</span>
        <span className="quest-language">{languageName}</span>
        <span className="quest-level">{quest.level}</span>
      </div>
      
      <h3 className="quest-title">{quest.title}</h3>
      
      <div className="quest-card-footer">
        <div className="quest-time">
          <span className="time-icon">⏱️</span>
          <span>{quest.estimatedTime} min</span>
        </div>
        <button className="quest-start-btn" onClick={handleClick}>
          Start Quest →
        </button>
      </div>
    </div>
  );
};

export default QuestCard;
