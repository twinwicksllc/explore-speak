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
          {quest.questDialogue?.scenario && (
            <section className="content-section">
              <h2>📖 Overview</h2>
              <div className="quest-overview">
                <p><strong>Setting:</strong> {quest.questDialogue.scenario.setting}</p>
                <p><strong>Goal:</strong> {quest.questDialogue.scenario.goal}</p>
                {quest.questDialogue.scenario.guideIntro && (
                  <p className="guide-intro">💬 <em>{quest.questDialogue.scenario.guideIntro}</em></p>
                )}
              </div>
            </section>
          )}

          {/* Cultural Context */}
          {quest.preQuest?.culturalNote && (
            <section className="content-section cultural-context">
              <h2>🌍 {quest.preQuest.culturalNote.title || 'Cultural Context'}</h2>
              <p>{quest.preQuest.culturalNote.content}</p>
            </section>
          )}

          {/* Grammar Pattern */}
          {quest.preQuest?.grammar && (
            <section className="content-section">
              <h2>📝 Grammar Focus</h2>
              <div className="grammar-section">
                <p><strong>Pattern:</strong> {quest.preQuest.grammar.pattern}</p>
                <p><strong>Explanation:</strong> {quest.preQuest.grammar.explanation}</p>
                {quest.preQuest.grammar.examples && quest.preQuest.grammar.examples.length > 0 && (
                  <div className="grammar-examples">
                    <p><strong>Examples:</strong></p>
                    <ul>
                      {quest.preQuest.grammar.examples.map((example: any, index: number) => (
                        <li key={index}>
                          {example.targetLanguage} <span className="translation">({example.english})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Vocabulary Preview */}
          {quest.preQuest?.vocabulary && quest.preQuest.vocabulary.length > 0 && (
            <section className="content-section">
              <h2>📚 Key Vocabulary</h2>
              <div className="vocabulary-grid">
                {quest.preQuest.vocabulary.slice(0, 6).map((vocab: any, index: number) => (
                  <div key={index} className="vocab-card">
                    <div className="vocab-word">{vocab.word}</div>
                    <div className="vocab-translation">{vocab.translation}</div>
                  </div>
                ))}
              </div>
              {quest.preQuest.vocabulary.length > 6 && (
                <p className="vocab-more">
                  +{quest.preQuest.vocabulary.length - 6} more words to learn
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
