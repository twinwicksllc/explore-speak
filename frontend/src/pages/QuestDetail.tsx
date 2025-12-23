import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
import './QuestDetail.css';

const QuestDetail: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { currentQuest, loading, error, fetchQuestById, startQuest } = useQuest();
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (questId && user?.userId) {
      fetchQuestById(questId, user.userId);
    }
  }, [questId, user, fetchQuestById]);

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  const handleStartQuest = async () => {
    if (!questId || !user?.userId) return;
    
    setStarting(true);
    try {
      await startQuest(questId, user.userId);
      navigate(`/quests/${questId}/play`);
    } catch (err) {
      console.error('Failed to start quest:', err);
      setStarting(false);
    }
  };

  const handleBack = () => {
    navigate('/quests');
  };

  if (loading) {
    return (
      <div className="quest-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading quest details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quest-detail-container">
        <div className="error-state">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={handleBack} className="back-button">
            ← Back to Quests
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuest) {
    return (
      <div className="quest-detail-container">
        <div className="error-state">
          <h2>Quest Not Found</h2>
          <p>The quest you're looking for doesn't exist.</p>
          <button onClick={handleBack} className="back-button">
            ← Back to Quests
          </button>
        </div>
      </div>
    );
  }

  const quest = currentQuest.quest;
  const progress = currentQuest.userProgress;

  return (
    <div className="quest-detail-container">
      <nav className="quest-detail-nav">
        <div className="nav-left">
          <button onClick={handleBack} className="back-link">
            ← Back to Quests
          </button>
        </div>
        <div className="nav-brand">
          <h1>Explore Speak</h1>
        </div>
        <div className="nav-right">
          <button onClick={handleSignout} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="quest-detail-main">
        <div className="quest-header">
          <div className="quest-title-section">
            <h1 className="quest-title">{quest.title}</h1>
            <div className="quest-meta">
              <span className="quest-level">📊 {quest.level}</span>
              <span className="quest-time">⏱️ {quest.estimatedTime} min</span>
              <span className={`quest-status status-${progress?.status || 'not_started'}`}>
                {progress?.status === 'completed' && '✅ Completed'}
                {progress?.status === 'in_progress' && '🔄 In Progress'}
                {(!progress || progress.status === 'not_started') && '🆕 Not Started'}
              </span>
            </div>
          </div>
        </div>

        <div className="quest-content">
          {/* Overview Section */}
          <section className="content-section">
            <h2>📖 Overview</h2>
            <p className="quest-overview">{quest.overview}</p>
          </section>

          {/* Cultural Context */}
          {quest.culturalContext && (
            <section className="content-section cultural-context">
              <h2>🌍 Cultural Context</h2>
              <p>{quest.culturalContext}</p>
            </section>
          )}

          {/* Learning Objectives */}
          {quest.learningObjectives && quest.learningObjectives.length > 0 && (
            <section className="content-section">
              <h2>🎯 Learning Objectives</h2>
              <ul className="objectives-list">
                {quest.learningObjectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Vocabulary Preview */}
          {quest.preQuest?.keyVocabulary && quest.preQuest.keyVocabulary.length > 0 && (
            <section className="content-section">
              <h2>📚 Key Vocabulary</h2>
              <div className="vocabulary-grid">
                {quest.preQuest.keyVocabulary.slice(0, 6).map((vocab, index) => (
                  <div key={index} className="vocab-card">
                    <div className="vocab-word">{vocab.word}</div>
                    <div className="vocab-translation">{vocab.translation}</div>
                  </div>
                ))}
              </div>
              {quest.preQuest.keyVocabulary.length > 6 && (
                <p className="vocab-more">
                  +{quest.preQuest.keyVocabulary.length - 6} more words to learn
                </p>
              )}
            </section>
          )}

          {/* Start Button */}
          <section className="content-section action-section">
            {progress?.status === 'completed' ? (
              <div className="completed-message">
                <h3>🎉 You've completed this quest!</h3>
                <p>Score: {progress.score || 0}%</p>
                <button onClick={handleStartQuest} className="retry-button" disabled={starting}>
                  {starting ? 'Starting...' : '🔄 Retry Quest'}
                </button>
              </div>
            ) : progress?.status === 'in_progress' ? (
              <button onClick={handleStartQuest} className="continue-button" disabled={starting}>
                {starting ? 'Loading...' : '▶️ Continue Quest'}
              </button>
            ) : (
              <button onClick={handleStartQuest} className="start-button" disabled={starting}>
                {starting ? 'Starting...' : '🚀 Start Quest'}
              </button>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default QuestDetail;
