import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
import QuestCard from '../components/quests/QuestCard';
import './QuestList.css';

const QuestList: React.FC = () => {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { quests, loading, error, fetchQuests } = useQuest();

  useEffect(() => {
    // Fetch quests when component mounts
    fetchQuests();
  }, [fetchQuests]);

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="quest-list-container">
      {/* Navigation Bar */}
      <nav className="quest-nav">
        <div className="nav-brand">
          <h1>Explore Speak</h1>
        </div>
        <div className="nav-actions">
          <button onClick={handleBackToDashboard} className="back-button">
            ← Dashboard
          </button>
          <button onClick={handleSignout} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="quest-list-main">
        <div className="quest-list-header">
          <h2>Choose Your Quest</h2>
          <p className="quest-list-subtitle">
            Select a language learning adventure to begin your journey
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading quests...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <p className="error-message">{error}</p>
            <button onClick={fetchQuests} className="retry-button">
              Try Again
            </button>
          </div>
        )}

        {/* Quest Grid */}
        {!loading && !error && quests.length > 0 && (
          <div className="quest-grid">
            {quests.map((quest) => (
              <QuestCard key={quest.questId} quest={quest} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && quests.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">📚</p>
            <p className="empty-message">No quests available yet</p>
            <p className="empty-subtitle">Check back soon for new adventures!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestList;
