import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adaptiveLearningService from '../services/adaptiveLearningService';
import vocabularyService from '../services/vocabularyService';
import { LearnerProfile, QuestRecommendation, DailyGoal } from '../types/adaptive';
import { VocabularyStats } from '../types/srs';
import './PersonalizedDashboard.css';

const PersonalizedDashboard: React.FC = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [recommendations, setRecommendations] = useState<QuestRecommendation[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [vocabStats, setVocabStats] = useState<VocabularyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('French');

  useEffect(() => {
    if (user) {
      loadPersonalizedData();
    }
  }, [user, selectedLanguage]);

  const loadPersonalizedData = async () => {
    try {
      setLoading(true);
      
      // Load learner profile
      const userProfile = await adaptiveLearningService.getLearnerProfile(
        user!.userId,
        selectedLanguage
      );
      setProfile(userProfile);

      // Load quest recommendations
      const quests = await adaptiveLearningService.getPersonalizedQuests(
        user!.userId,
        selectedLanguage,
        5
      );
      setRecommendations(quests);

      // Load daily goal
      const goal = await adaptiveLearningService.getDailyGoal(
        user!.userId,
        selectedLanguage
      );
      setDailyGoal(goal);

      // Load vocabulary stats
      const stats = await vocabularyService.getVocabularyStats(
        user!.userId,
        selectedLanguage
      );
      setVocabStats(stats);
    } catch (error) {
      console.error('Error loading personalized data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignout = () => {
    signout();
    navigate('/login');
  };

  const getNextLevel = (currentLevel: string): string => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : 'C2';
  };

  const getDifficultyColor = (difficulty: number): string => {
    if (difficulty <= 3) return '#10b981'; // Easy - green
    if (difficulty <= 6) return '#3b82f6'; // Medium - blue
    return '#ef4444'; // Hard - red
  };

  if (loading) {
    return (
      <div className="personalized-dashboard loading">
        <div className="spinner"></div>
        <p>Loading your personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="personalized-dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>ExploreSpeak</h1>
        </div>
        <div className="nav-actions">
          <select 
            value={selectedLanguage} 
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="language-selector"
          >
            <option value="French">🇫🇷 French</option>
            <option value="Portuguese">🇧🇷 Portuguese</option>
            <option value="Italian">🇮🇹 Italian</option>
            <option value="Japanese">🇯🇵 Japanese</option>
          </select>
          <button onClick={handleSignout} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p className="welcome-subtitle">
            Your personalized learning journey in {selectedLanguage}
          </p>
        </section>

        {/* Learning Path Progress */}
        {profile && (
          <section className="learning-path">
            <h3>📈 Your Learning Journey</h3>
            <div className="level-progress-card">
              <div className="level-info">
                <span className="current-level">{profile.overallLevel}</span>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${profile.levelProgress}%` }}
                  />
                </div>
                <span className="next-level">{getNextLevel(profile.overallLevel)}</span>
              </div>
              <div className="level-stats">
                <div className="stat">
                  <span className="stat-value">{profile.vocabularySize}</span>
                  <span className="stat-label">Words Learned</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.streakDays}</span>
                  <span className="stat-label">Day Streak</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{Math.round(profile.totalStudyTime / 60)}h</span>
                  <span className="stat-label">Study Time</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Daily Goal */}
        {dailyGoal && (
          <section className="daily-goal">
            <h3>🎯 Today's Goal</h3>
            <div className="goal-card">
              <p className="goal-description">{dailyGoal.description}</p>
              <div className="goal-progress">
                <div className="goal-progress-bar">
                  <div 
                    className="goal-progress-fill"
                    style={{ width: `${Math.min((dailyGoal.completed / dailyGoal.target) * 100, 100)}%` }}
                  />
                </div>
                <span className="goal-numbers">
                  {dailyGoal.completed} / {dailyGoal.target}
                </span>
              </div>
              {dailyGoal.isComplete && (
                <div className="goal-complete">
                  <span className="complete-badge">✓ Goal Complete!</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Vocabulary Review Widget */}
        {vocabStats && vocabStats.dueToday > 0 && (
          <section className="vocab-review-widget">
            <h3>📚 Vocabulary Review</h3>
            <div className="vocab-card">
              <div className="vocab-stats-grid">
                <div className="vocab-stat">
                  <span className="vocab-stat-value">{vocabStats.dueToday}</span>
                  <span className="vocab-stat-label">Due Today</span>
                </div>
                <div className="vocab-stat">
                  <span className="vocab-stat-value">{vocabStats.masteredCards}</span>
                  <span className="vocab-stat-label">Mastered</span>
                </div>
                <div className="vocab-stat">
                  <span className="vocab-stat-value">{vocabStats.averageRetention}%</span>
                  <span className="vocab-stat-label">Retention</span>
                </div>
              </div>
              <button 
                onClick={() => navigate('/vocabulary/review')}
                className="start-review-button"
              >
                Start Review Session
              </button>
            </div>
          </section>
        )}

        {/* Recommended Quests */}
        <section className="recommendations">
          <h3>✨ Recommended for You</h3>
          <div className="quest-recommendations">
            {recommendations.length > 0 ? (
              recommendations.map(rec => (
                <div key={rec.questId} className="recommendation-card">
                  <div className="recommendation-header">
                    <h4>{rec.title}</h4>
                    <span 
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(rec.difficulty) }}
                    >
                      Level {rec.level}
                    </span>
                  </div>
                  
                  <div className="recommendation-meta">
                    <div className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      <span>{rec.estimatedTime} min</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">🎯</span>
                      <span>{rec.estimatedSuccessRate}% success rate</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⭐</span>
                      <span>{rec.relevanceScore}% match</span>
                    </div>
                  </div>

                  <p className="recommendation-reasoning">{rec.reasoning}</p>

                  {rec.addressesWeakness && (
                    <span className="weakness-badge">💪 Improves weak areas</span>
                  )}
                  
                  {rec.matchesInterest && (
                    <span className="interest-badge">❤️ Matches your interests</span>
                  )}

                  <button 
                    onClick={() => navigate(`/quests/${rec.questId}`)}
                    className="start-quest-button"
                  >
                    Start Quest
                  </button>
                </div>
              ))
            ) : (
              <div className="no-recommendations">
                <p>🎉 You've completed all available quests!</p>
                <p>Check back soon for new content.</p>
              </div>
            )}
          </div>
        </section>

        {/* Weak Areas Focus */}
        {profile && profile.weaknessAreas.length > 0 && (
          <section className="focus-areas">
            <h3>💪 Areas to Improve</h3>
            <div className="weakness-cards">
              {profile.weaknessAreas.map(area => (
                <div key={area} className="weakness-card">
                  <span className="area-icon">📖</span>
                  <span className="area-name">{area}</span>
                  <button 
                    onClick={() => {
                      // Filter recommendations by this weakness
                      const filtered = recommendations.filter(r => 
                        r.reasoning.toLowerCase().includes(area.toLowerCase())
                      );
                      if (filtered.length > 0) {
                        navigate(`/quests/${filtered[0].questId}`);
                      }
                    }}
                    className="practice-button"
                  >
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Learning Analytics */}
        {profile && (
          <section className="analytics">
            <h3>📊 Your Progress</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🔥</span>
                <span className="stat-value">{profile.streakDays}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📚</span>
                <span className="stat-value">{profile.vocabularySize}</span>
                <span className="stat-label">Vocabulary</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⏰</span>
                <span className="stat-value">{Math.round(profile.totalStudyTime / 60)}h</span>
                <span className="stat-label">Study Time</span>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✓</span>
                <span className="stat-value">{profile.completionRate}%</span>
                <span className="stat-label">Completion</span>
              </div>
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="quick-actions">
          <h3>⚡ Quick Actions</h3>
          <div className="action-buttons">
            <button onClick={() => navigate('/quests')} className="action-button">
              <span className="action-icon">🗺️</span>
              <span>Browse All Quests</span>
            </button>
            {vocabStats && vocabStats.dueToday > 0 && (
              <button onClick={() => navigate('/vocabulary/review')} className="action-button">
                <span className="action-icon">📚</span>
                <span>Review Vocabulary</span>
              </button>
            )}
            <button onClick={() => navigate('/progress')} className="action-button">
              <span className="action-icon">📈</span>
              <span>View Progress</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PersonalizedDashboard;