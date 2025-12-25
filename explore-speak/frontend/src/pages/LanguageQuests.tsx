import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
import QuestCard from '../components/quests/QuestCard';
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

        {/* Quest Grid */}
        {!loading && !error && (
          <>
            {filteredQuests.length > 0 ? (
              <>
                <div className="quests-info">
                  <h3>Available Adventures</h3>
                  <p>Choose a quest to begin your {languageInfo.name} learning journey</p>
                </div>
                <div className="quest-grid">
                  {filteredQuests.map((quest) => (
                    <QuestCard key={quest.questId} quest={quest} />
                  ))}
                </div>
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