#!/bin/bash

# Frontend Integration Script
# Updates frontend to use the new SRS and Adaptive Learning features

echo "🚀 Integrating new features into frontend..."

# Update App.tsx to add new routes
echo "Updating App.tsx with new routes..."
cat > frontend/src/App.tsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ConfirmEmail from './components/auth/ConfirmEmail';
import PersonalizedDashboard from './pages/PersonalizedDashboard';
import QuestList from './pages/QuestList';
import QuestDetail from './pages/QuestDetail';
import QuestPlay from './pages/QuestPlay';
import QuestComplete from './pages/QuestComplete';
import VocabularyReview from './components/vocabulary/VocabularyReview';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirm" element={<ConfirmEmail />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <PersonalizedDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PersonalizedDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/quests" element={
              <ProtectedRoute>
                <QuestList />
              </ProtectedRoute>
            } />
            
            <Route path="/quests/:questId" element={
              <ProtectedRoute>
                <QuestDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/play/:questId" element={
              <ProtectedRoute>
                <QuestPlay />
              </ProtectedRoute>
            } />
            
            <Route path="/complete/:questId" element={
              <ProtectedRoute>
                <QuestComplete />
              </ProtectedRoute>
            } />
            
            <Route path="/vocabulary/review" element={
              <ProtectedRoute>
                <VocabularyReview />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
EOF

echo "✅ App.tsx updated"

# Update QuestComplete.tsx to integrate with SRS and Adaptive Learning
echo "Updating QuestComplete.tsx with SRS integration..."
cat > frontend/src/pages/QuestComplete.tsx << 'EOF'
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import vocabularyService from '../services/vocabularyService';
import adaptiveLearningService from '../services/adaptiveLearningService';
import questService from '../services/questService';
import './QuestComplete.css';

const QuestComplete: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quest, setQuest] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [integrating, setIntegrating] = useState(false);

  useEffect(() => {
    if (questId) {
      loadQuest();
    }
  }, [questId]);

  const loadQuest = async () => {
    try {
      const questData = await questService.getQuest(questId!);
      setQuest(questData);
    } catch (error) {
      console.error('Error loading quest:', error);
    }
  };

  const handleContinue = async () => {
    if (!user || !quest) return;
    
    setIntegrating(true);
    
    try {
      // Add vocabulary to SRS
      await vocabularyService.addVocabularyCards(
        user.userId,
        quest.questId,
        quest.content.preQuest.keyVocabulary,
        quest.language
      );

      // Update learner profile
      await adaptiveLearningService.updateLearnerProfile(
        user.userId,
        quest.language,
        quest.questId,
        85, // Mock score - you'd get this from quest completion
        15  // Mock time spent - you'd get this from quest completion
      );

      // Save performance metrics
      await adaptiveLearningService.savePerformanceMetrics(
        user.userId,
        quest.questId,
        {
          score: 85,
          timeSpent: 15,
          difficulty: getLevelDifficulty(quest.level),
          topics: extractTopics(quest),
        }
      );

      navigate('/dashboard');
    } catch (error) {
      console.error('Error integrating with SRS:', error);
      // Still navigate even if integration fails
      navigate('/dashboard');
    } finally {
      setIntegrating(false);
    }
  };

  const getLevelDifficulty = (level: string): number => {
    const levelMap: Record<string, number> = {
      'A1': 1,
      'A2': 3,
      'B1': 5,
      'B2': 7,
      'C1': 9,
      'C2': 10,
    };
    return levelMap[level] || 5;
  };

  const extractTopics = (quest: any): string[] => {
    const topics: string[] = [];
    quest.content.preQuest.learningObjectives.forEach((obj: string) => {
      const lower = obj.toLowerCase();
      if (lower.includes('greeting')) topics.push('greetings');
      if (lower.includes('order')) topics.push('ordering');
      if (lower.includes('direction')) topics.push('directions');
      if (lower.includes('conversation')) topics.push('conversation');
    });
    return [...new Set(topics)];
  };

  if (!quest) {
    return (
      <div className="quest-complete">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="quest-complete">
      <div className="completion-card">
        <h1>🎉 Quest Complete!</h1>
        <h2>{quest.title}</h2>
        
        <div className="completion-stats">
          <div className="stat">
            <span className="stat-label">XP Earned</span>
            <span className="stat-value">+100</span>
          </div>
          <div className="stat">
            <span className="stat-label">Language</span>
            <span className="stat-value">{quest.language}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Level</span>
            <span className="stat-value">{quest.level}</span>
          </div>
        </div>

        <div className="vocabulary-added">
          <h3>📚 Vocabulary Added to Review</h3>
          <div className="vocabulary-list">
            {quest.content.preQuest.keyVocabulary.map((item: any, index: number) => (
              <div key={index} className="vocab-item">
                <span className="word">{item.word}</span>
                <span className="translation">{item.translation}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="actions">
          <button 
            onClick={handleContinue}
            disabled={integrating}
            className="continue-button"
          >
            {integrating ? 'Integrating...' : 'Continue to Dashboard'}
          </button>
          <button 
            onClick={() => navigate('/vocabulary/review')}
            className="review-button"
          >
            Review Vocabulary
          </button>
          <button 
            onClick={() => navigate('/quests')}
            className="browse-button"
          >
            Browse More Quests
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestComplete;
EOF

echo "✅ QuestComplete.tsx updated"

echo "🎉 Frontend integration complete!"
echo ""
echo "📋 Changes made:"
echo "✅ Added /vocabulary/review route"
echo "✅ Updated App.tsx to use PersonalizedDashboard"
echo "✅ Integrated SRS in QuestComplete.tsx"
echo ""
echo "🌐 Next: Build and deploy frontend to S3"