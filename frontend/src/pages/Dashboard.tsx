import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

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
          <h1>Explore Speak</h1>
        </div>
        <div className="nav-actions">
          <button onClick={handleSignout} className="signout-button">
            Sign Out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user.name}! 👋</h2>
          <p className="welcome-subtitle">Ready to continue your language learning journey?</p>
          <button onClick={() => navigate('/quests')} className="browse-quests-button">
            🌍 Browse Quests
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>Level {user.level || 1}</h3>
              <p>Current Level</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{user.xp || 0} XP</h3>
              <p>Experience Points</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{user.streak || 0} Days</h3>
              <p>Current Streak</p>
            </div>
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>🚀 Start Your Language Adventure!</h3>
            <p>Choose from 4 interactive quests in French, Portuguese, Italian, and Japanese.</p>
            <p className="info-details">
              Each quest includes:
              <br />• Cultural context and learning objectives
              <br />• Interactive dialogue with AI guides
              <br />• Vocabulary and grammar exercises
              <br />• XP rewards and achievements
            </p>
            <div className="info-note">
              Click <strong>Browse Quests</strong> above to get started!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
