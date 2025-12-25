import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>{t.nav.exploreSpeak}</h1>
        </div>
        <div className="nav-actions">
          <LanguageSwitcher />
          <button onClick={handleSignout} className="signout-button">
            {t.nav.signOut}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>{t.dashboard.welcomeBack}, {user.name}! 👋</h2>
          <p className="welcome-subtitle">{t.dashboard.readyToContinue}</p>
          <button onClick={() => navigate('/languages')} className="browse-quests-button">
            🌍 {t.dashboard.browseLanguages}
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{t.quests.level} {user.level || 1}</h3>
              <p>{t.dashboard.currentLevel}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{user.xp || 0} XP</h3>
              <p>{t.dashboard.experiencePoints}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{user.streak || 0} {t.dashboard.days}</h3>
              <p>{t.dashboard.currentStreak}</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>🚀 {t.dashboard.startAdventure}</h3>
            <p>{t.dashboard.chooseFrom}</p>
            <p className="info-details">
              {t.dashboard.eachQuestIncludes}
              <br />• {t.dashboard.culturalContext}
              <br />• {t.dashboard.interactiveDialogue}
              <br />• {t.dashboard.vocabularyExercises}
              <br />• {t.dashboard.xpRewards}
                  <br />• {t.dashboard.specializedTracks}
            </p>
            <div className="info-note">
              {t.dashboard.clickBrowse}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
