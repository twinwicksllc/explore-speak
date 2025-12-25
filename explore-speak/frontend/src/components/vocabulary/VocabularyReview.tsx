import React, { useState, useEffect } from 'react';
import { VocabularyCard } from '../../types/srs';
import { calculateNextReview } from '../../utils/sm2Algorithm';
import vocabularyService from '../../services/vocabularyService';
import { useAuth } from '../../context/AuthContext';
import './VocabularyReview.css';

const VocabularyReview: React.FC = () => {
  const { user } = useAuth();
  const [dueCards, setDueCards] = useState<VocabularyCard[]>([]);
  const [currentCard, setCurrentCard] = useState<VocabularyCard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionStats, setSessionStats] = useState({
    cardsReviewed: 0,
    cardsCorrect: 0,
    cardsIncorrect: 0,
    totalResponseTime: 0,
    sessionStartTime: Date.now(),
  });
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (user) {
      loadDueCards();
    }
  }, [user]);

  const loadDueCards = async () => {
    try {
      setLoading(true);
      
      // Start review session
      const sessionResult = await vocabularyService.startReviewSession(
        user!.userId,
        'French' // TODO: Get from user preferences
      );
      setSessionId(sessionResult.sessionId);

      // Get due cards
      const result = await vocabularyService.getDueCards(
        user!.userId,
        'French' // TODO: Get from user preferences
      );

      setDueCards(result.cards);
      if (result.cards.length > 0) {
        setCurrentCard(result.cards[0]);
        setCardStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error loading due cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (quality: 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard || !user) return;

    const responseTime = Date.now() - cardStartTime;

    try {
      // Update card with SM-2 algorithm
      await vocabularyService.updateCard({
        cardId: currentCard.cardId,
        userId: user.userId,
        quality,
        responseTime,
      });

      // Update session stats
      const isCorrect = quality >= 3;
      setSessionStats(prev => ({
        cardsReviewed: prev.cardsReviewed + 1,
        cardsCorrect: prev.cardsCorrect + (isCorrect ? 1 : 0),
        cardsIncorrect: prev.cardsIncorrect + (isCorrect ? 0 : 1),
        totalResponseTime: prev.totalResponseTime + responseTime,
        sessionStartTime: prev.sessionStartTime,
      }));

      // Move to next card
      const remaining = dueCards.slice(1);
      setDueCards(remaining);
      
      if (remaining.length > 0) {
        setCurrentCard(remaining[0]);
        setShowAnswer(false);
        setCardStartTime(Date.now());
      } else {
        // Session complete
        await completeSession();
        setCurrentCard(null);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const completeSession = async () => {
    if (!user || !sessionId) return;

    const sessionDuration = Math.round((Date.now() - sessionStats.sessionStartTime) / 1000);
    const averageResponseTime = sessionStats.cardsReviewed > 0
      ? Math.round(sessionStats.totalResponseTime / sessionStats.cardsReviewed)
      : 0;

    try {
      await vocabularyService.completeReviewSession(sessionId, user.userId, {
        cardsReviewed: sessionStats.cardsReviewed,
        cardsCorrect: sessionStats.cardsCorrect,
        cardsIncorrect: sessionStats.cardsIncorrect,
        averageResponseTime,
        sessionDuration,
      });
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const getQualityLabel = (quality: number): string => {
    const labels: Record<number, string> = {
      1: 'Again',
      2: 'Hard',
      3: 'Good',
      4: 'Easy',
      5: 'Perfect',
    };
    return labels[quality] || 'Unknown';
  };

  const getQualityColor = (quality: number): string => {
    const colors: Record<number, string> = {
      1: '#ef4444',
      2: '#f97316',
      3: '#3b82f6',
      4: '#10b981',
      5: '#8b5cf6',
    };
    return colors[quality] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="vocabulary-review loading">
        <div className="spinner"></div>
        <p>Loading your vocabulary cards...</p>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="vocabulary-review complete">
        <div className="completion-card">
          <h2>🎉 Review Complete!</h2>
          <div className="session-summary">
            <div className="summary-stat">
              <span className="stat-label">Cards Reviewed</span>
              <span className="stat-value">{sessionStats.cardsReviewed}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Correct</span>
              <span className="stat-value correct">{sessionStats.cardsCorrect}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Incorrect</span>
              <span className="stat-value incorrect">{sessionStats.cardsIncorrect}</span>
            </div>
            <div className="summary-stat">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">
                {sessionStats.cardsReviewed > 0
                  ? Math.round((sessionStats.cardsCorrect / sessionStats.cardsReviewed) * 100)
                  : 0}%
              </span>
            </div>
          </div>
          <p className="completion-message">
            Great work! Come back tomorrow for more practice.
          </p>
          <button onClick={() => window.location.href = '/dashboard'} className="return-button">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="vocabulary-review">
      <div className="review-header">
        <div className="progress-info">
          <span className="cards-remaining">{dueCards.length} cards remaining</span>
          <div className="session-progress">
            <span className="correct-count">✓ {sessionStats.cardsCorrect}</span>
            <span className="incorrect-count">✗ {sessionStats.cardsIncorrect}</span>
          </div>
        </div>
      </div>

      <div className="flashcard-container">
        <div className={`flashcard ${showAnswer ? 'flipped' : ''}`}>
          <div className="card-front">
            <div className="card-language">
              <span className="language-badge">{currentCard.language}</span>
            </div>
            <div className="card-word">
              {currentCard.word}
            </div>
            {!showAnswer && (
              <button onClick={() => setShowAnswer(true)} className="show-answer-button">
                Show Answer
              </button>
            )}
          </div>

          {showAnswer && (
            <div className="card-back">
              <div className="card-translation">
                {currentCard.translation}
              </div>
              
              {currentCard.exampleSentence && (
                <div className="card-example">
                  <span className="example-label">Example:</span>
                  <p>{currentCard.exampleSentence}</p>
                </div>
              )}

              <div className="rating-section">
                <p className="rating-prompt">How well did you know this?</p>
                <div className="rating-buttons">
                  {[1, 2, 3, 4, 5].map(quality => (
                    <button
                      key={quality}
                      onClick={() => handleResponse(quality as 1 | 2 | 3 | 4 | 5)}
                      className="rating-button"
                      style={{ backgroundColor: getQualityColor(quality) }}
                    >
                      {getQualityLabel(quality)}
                    </button>
                  ))}
                </div>
                <div className="rating-guide">
                  <p><strong>Again:</strong> Complete blackout</p>
                  <p><strong>Hard:</strong> Incorrect, but familiar</p>
                  <p><strong>Good:</strong> Correct with effort</p>
                  <p><strong>Easy:</strong> Correct with hesitation</p>
                  <p><strong>Perfect:</strong> Instant recall</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="card-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Repetitions:</span>
            <span className="metadata-value">{currentCard.repetitions}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Success Rate:</span>
            <span className="metadata-value">
              {currentCard.correctCount + currentCard.incorrectCount > 0
                ? Math.round(
                    (currentCard.correctCount / (currentCard.correctCount + currentCard.incorrectCount)) * 100
                  )
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyReview;