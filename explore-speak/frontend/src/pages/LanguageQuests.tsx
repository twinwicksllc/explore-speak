import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
import QuestCard from '../components/quests/QuestCard';
import TommyGuide from '../components/guides/TommyGuide';
import { getTommyQuestsByLanguage, type TommyQuest } from '../data/tommyQuests';
import './LanguageQuests.css';

interface LanguageInfo {
  name: string;
  flag: string;
  description: string;
  color: string;
}

const LANGUAGE_INFO: Record<string, LanguageInfo> = {
  french: {
    name: 'French',
    flag: '🇫🇷',
    description: 'Master the language of love, culture, and cuisine',
    color: '#3b82f6'
  },
  portuguese: {
    name: 'Portuguese',
    flag: '🇵🇹',
    description: 'Journey through vibrant Brazil and Portugal',
    color: '#10b981'
  },
  'portuguese-to-english': {
    name: 'Portuguese to English',
    flag: '🇧🇷→🇺🇸',
    description: 'Master English with Tommy, your Brazilian guide',
    color: '#06b6d4'
  },
  italian: {
    name: 'Italian',
    flag: '🇮🇹',
    description: 'Experience la dolce vita and Renaissance culture',
    color: '#f59e0b'
  },
  japanese: {
    name: 'Japanese',
    flag: '🇯🇵',
    description: 'Discover the land of samurai, sushi, and technology',
    color: '#ef4444'
  },
  spanish: {
    name: 'Spanish',
    flag: '🇪🇸',
    description: 'Travel through Spain and Latin America',
    color: '#f97316'
  },
  'spanish-to-english': {
    name: 'Spanish to English',
    flag: '🇲🇽→🇺🇸',
    description: 'Learn English with Tommy, your Mexican guide',
    color: '#a855f7'
  },
  german: {
    name: 'German',
    flag: '🇩🇪',
    description: 'Master the language of engineering and philosophy',
    color: '#8b5cf6'
  }
};

const LanguageQuests: React.FC = () => {
  const { languageCode } = useParams<{ languageCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quests, loading, error, fetchQuests } = useQuest();
  const [filteredQuests, setFilteredQuests] = useState<any[]>([]);
  const [tommyQuests, setTommyQuests] = useState<TommyQuest[]>([]);
  const [showTommyGuide, setShowTommyGuide] = useState(false);

  const languageInfo = languageCode ? LANGUAGE_INFO[languageCode] : null;

  useEffect(() => {
    if (user?.userId) {
      fetchQuests(user.userId);
    }
  }, [fetchQuests, user]);

  useEffect(() => {
    if (quests.length > 0 && languageCode) {
      // Filter quests by language code
      const languagePrefix = getLanguagePrefix(languageCode);
      const filtered = quests.filter(quest => 
        quest.questId.startsWith(languagePrefix)
      );
      setFilteredQuests(filtered);
    }
  }, [quests, languageCode]);

  // Load Tommy's quests for Portuguese to English and Spanish to English
  useEffect(() => {
    if (languageCode && (languageCode === 'portuguese-to-english' || languageCode === 'spanish-to-english')) {
      const languageSpecificQuests = getTommyQuestsByLanguage(languageCode);
      setTommyQuests(languageSpecificQuests);
      setShowTommyGuide(true);
    } else {
      setTommyQuests([]);
      setShowTommyGuide(false);
    }
  }, [languageCode]);

  // Helper function to get language prefix from full language name
  const getLanguagePrefix = (languageCode: string): string => {
    const prefixMap: Record<string, string> = {
      french: 'fr',
      portuguese: 'pt',
      italian: 'it',
      japanese: 'jp',
      spanish: 'es',
      german: 'de'
    };
    return prefixMap[languageCode] || languageCode;
  };

  const handleBackToLanguages = () => {
    navigate('/languages');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!languageInfo) {
    return (
      <div className="language-quests-container">
        <div className="error-state">
          <h2>Language Not Found</h2>
          <p>The language you're looking for is not available.</p>
          <button onClick={handleBackToLanguages} className="back-button">
            ← Back to Languages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="language-quests-container">
      {/* Navigation Bar */}
      <nav className="language-quests-nav">
        <div className="nav-brand">
          <h1>Explore Speak</h1>
        </div>
        <div className="nav-actions">
          <button onClick={handleBackToLanguages} className="secondary-button">
            ← Languages
          </button>
          <button onClick={handleBackToDashboard} className="secondary-button">
            Dashboard
          </button>
        </div>
      </nav>

      {/* Language Header */}
      <div className="language-header" style={{ '--language-color': languageInfo.color } as React.CSSProperties}>
        <div className="language-header-content">
          <div className="language-title-section">
            <span className="language-flag">{languageInfo.flag}</span>
            <div className="language-title-text">
              <h2>{languageInfo.name} Quests</h2>
              <p className="language-description">{languageInfo.description}</p>
            </div>
          </div>
          <div className="quest-stats">
            <div className="stat-item">
              <span className="stat-number">{filteredQuests.length}</span>
              <span className="stat-label">Available Quests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="language-quests-main">
        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading {languageInfo.name} quests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={() => fetchQuests(user.userId)} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Tommy Guide for Portuguese to English and Spanish to English */}
        {showTommyGuide && (
          <TommyGuide 
            language={languageCode === 'portuguese-to-english' ? 'portuguese' : 'spanish'}
            questTitle={`${languageInfo.name} Learning Path`}
            currentLevel={1}
            onMessage={(message) => console.log('Tommy message:', message)}
          />
        )}

        {/* Quest Grid */}
        {!loading && !error && (
          <>
            {(filteredQuests.length > 0 || tommyQuests.length > 0) ? (
              <>
                <div className="quests-info">
                  <h3>Available Adventures</h3>
                  <p>Choose a quest to begin your {languageInfo.name} learning journey</p>
                </div>
                
                {/* Tommy's Quests */}
                {tommyQuests.length > 0 && (
                  <>
                    <div className="quest-section">
                      <h4 className="section-title">🎯 Tommy's Special Quests</h4>
                      <div className="quest-grid">
                        {tommyQuests.map((quest) => (
                          <div key={quest.id} className="tommy-quest-card">
                            <div className="tommy-quest-header">
                              <span className="quest-language-badge">
                                {quest.language === 'portuguese-to-english' ? '🇧🇷→🇺🇸' : '🇲🇽→🇺🇸'}
                              </span>
                              <span className="quest-level-badge">Level {quest.level}</span>
                            </div>
                            <h5 className="tommy-quest-title">{quest.title}</h5>
                            <p className="tommy-quest-description">{quest.description}</p>
                            <div className="tommy-quest-meta">
                              <span className="time-estimate">⏱️ {quest.estimatedTime} min</span>
                              <span className="category-tag">{quest.category}</span>
                            </div>
                            <button 
                              className="tommy-quest-button"
                              onClick={() => navigate(`/quests/${quest.id}/play`)}
                            >
                              Start with Tommy →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {/* Regular Quests */}
                {filteredQuests.length > 0 && (
                  <div className="quest-section">
                    {tommyQuests.length > 0 && <h4 className="section-title">📚 Standard Quests</h4>}
                    <div className="quest-grid">
                      {filteredQuests.map((quest) => (
                        <QuestCard key={quest.questId} quest={quest} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <span className="empty-icon">🚧</span>
                <h3>No Quests Available Yet</h3>
                <p>We're working on creating amazing {languageInfo.name} quests for you!</p>
                <p className="empty-subtitle">Check back soon for new adventures.</p>
                <button onClick={handleBackToLanguages} className="secondary-button">
                  Explore Other Languages
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default LanguageQuests;