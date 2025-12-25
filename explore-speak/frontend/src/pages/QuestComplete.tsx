import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuest } from '../context/QuestContext';
import './QuestComplete.css';

const QuestComplete: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { currentQuest } = useQuest();

  useEffect(() => {
    // Confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];

    const frame = () => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) return;

      const particleCount = 2;
      
      // Create confetti effect (simplified for demo)
      requestAnimationFrame(frame);
    };

    frame();
  }, []);

  const handleContinue = () => {
    navigate('/quests');
  };

  const handleRetry = () => {
    navigate(`/quests/${questId}`);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  // Mock data for now - in real app this would come from backend
  const questData = {
    title: currentQuest?.quest?.title || 'Quest Complete!',
    language: currentQuest?.quest?.language || 'Portuguese',
    score: 100,
    xpEarned: 50,
    achievements: [
      { id: 1, name: 'First Steps', description: 'Completed your first quest', icon: '🎯' },
      { id: 2, name: 'Coffee Connoisseur', description: 'Ordered coffee in Portuguese', icon: '☕' },
    ],
    vocabularyLearned: 8,
    phrasesLearned: 5,
  };

  return (
    <div className="quest-complete-container">
      <div className="quest-complete-card">
        {/* Header */}
        <div className="complete-header">
          <div className="success-icon">🎉</div>
          <h1>Quest Complete!</h1>
          <p className="quest-title">{questData.title}</p>
        </div>

        {/* Score Section */}
        <div className="score-section">
          <div className="score-circle">
            <div className="score-value">{questData.score}%</div>
            <div className="score-label">Score</div>
          </div>
          <div className="xp-earned">
            <span className="xp-icon">⭐</span>
            <span className="xp-value">+{questData.xpEarned} XP</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{questData.vocabularyLearned}</div>
            <div className="stat-label">New Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-value">{questData.phrasesLearned}</div>
            <div className="stat-label">Phrases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-value">{questData.achievements.length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>

        {/* Achievements */}
        <div className="achievements-section">
          <h2>🏆 Achievements Unlocked</h2>
          <div className="achievements-list">
            {questData.achievements.map((achievement) => (
              <div key={achievement.id} className="achievement-item">
                <span className="achievement-icon">{achievement.icon}</span>
                <div className="achievement-info">
                  <div className="achievement-name">{achievement.name}</div>
                  <div className="achievement-description">{achievement.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="complete-actions">
          <button onClick={handleContinue} className="primary-button">
            Browse More Quests →
          </button>
          <div className="secondary-actions">
            <button onClick={handleRetry} className="secondary-button">
              🔄 Retry Quest
            </button>
            <button onClick={handleDashboard} className="secondary-button">
              📊 Dashboard
            </button>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="encouragement">
          <p>🌟 Great job! Keep practicing to improve your {questData.language} skills!</p>
        </div>
      </div>
    </div>
  );
};

export default QuestComplete;
