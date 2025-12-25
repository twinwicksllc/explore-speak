import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LanguageSelection.css';

interface Language {
  code: string;
  name: string;
  flag: string;
  description: string;
  questCount: number;
  difficulty: string;
  color: string;
}

const LanguageSelection: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const languages: Language[] = [
    {
      code: 'french',
      name: 'French',
      flag: '🇫🇷',
      description: 'Explore the language of love, culture, and cuisine',
      questCount: 12,
      difficulty: 'Intermediate',
      color: '#3b82f6'
    },
    {
      code: 'portuguese',
      name: 'Portuguese',
      flag: '🇵🇹',
      description: 'Journey through vibrant Brazil and Portugal',
      questCount: 10,
      difficulty: 'Beginner',
      color: '#10b981'
    },
    {
      code: 'portuguese-to-english',
      name: 'Portuguese to English',
      flag: '🇧🇷→🇺🇸',
      description: 'Master English with Tommy, your Brazilian guide',
      questCount: 8,
      difficulty: 'Beginner',
      color: '#06b6d4'
    },
    {
      code: 'italian',
      name: 'Italian',
      flag: '🇮🇹',
      description: 'Experience la dolce vita and Renaissance culture',
      questCount: 8,
      difficulty: 'Intermediate',
      color: '#f59e0b'
    },
    {
      code: 'japanese',
      name: 'Japanese',
      flag: '🇯🇵',
      description: 'Discover the land of samurai, sushi, and technology',
      questCount: 15,
      difficulty: 'Advanced',
      color: '#ef4444'
    },
    {
      code: 'spanish',
      name: 'Spanish',
      flag: '🇪🇸',
      description: 'Travel through Spain and Latin America',
      questCount: 14,
      difficulty: 'Beginner',
      color: '#f97316'
    },
    {
      code: 'spanish-to-english',
      name: 'Spanish to English',
      flag: '🇲🇽→🇺🇸',
      description: 'Learn English with Tommy, your Mexican guide',
      questCount: 8,
      difficulty: 'Beginner',
      color: '#a855f7'
    },
    {
      code: 'german',
      name: 'German',
      flag: '🇩🇪',
      description: 'Master the language of engineering and philosophy',
      questCount: 9,
      difficulty: 'Advanced',
      color: '#8b5cf6'
    }
  ];

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language.code);
    setIsNavigating(true);
    
    // Navigate to language-specific quest page
    setTimeout(() => {
      navigate(`/quests/${language.code}`);
    }, 300);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="language-selection-container">
      {/* Navigation Bar */}
      <nav className="language-nav">
        <div className="nav-brand">
          <h1>Explore Speak</h1>
        </div>
        <div className="nav-actions">
          <button onClick={handleBackToDashboard} className="back-button">
            ← Dashboard
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="language-selection-main">
        <div className="selection-header">
          <h2>Choose Your Language Journey</h2>
          <p>Select a language to explore available quests and start your learning adventure</p>
        </div>

        {/* Language Grid */}
        <div className="language-grid">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`language-card ${selectedLanguage === language.code ? 'selected' : ''} ${isNavigating && selectedLanguage === language.code ? 'navigating' : ''}`}
              onClick={() => handleLanguageSelect(language)}
              style={{ '--language-color': language.color } as React.CSSProperties}
            >
              <div className="language-card-header">
                <span className="language-flag">{language.flag}</span>
                <div className="language-info">
                  <h3 className="language-name">{language.name}</h3>
                  <span className={`language-difficulty difficulty-${language.difficulty.toLowerCase()}`}>
                    {language.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="language-description">{language.description}</p>
              
              <div className="language-card-footer">
                <div className="quest-count">
                  <span className="count-icon">📚</span>
                  <span>{language.questCount} quests available</span>
                </div>
                <button className="select-button">
                  Select Language →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Overlay */}
        {isNavigating && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>Loading {languages.find(l => l.code === selectedLanguage)?.name} quests...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LanguageSelection;