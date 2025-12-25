import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuestProvider } from './context/QuestContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ConfirmEmail from './components/auth/ConfirmEmail';
import Dashboard from './pages/Dashboard';
import QuestList from './pages/QuestList';
import LanguageSelection from './pages/LanguageSelection';
import LanguageQuests from './pages/LanguageQuests';
import QuestDetail from './pages/QuestDetail';
import QuestPlay from './pages/QuestPlay';
import QuestComplete from './pages/QuestComplete';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <AuthProvider>
          <QuestProvider>
          <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/confirm-email" element={<ConfirmEmail />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/quests" element={
            <ProtectedRoute>
              <QuestList />
            </ProtectedRoute>
          } />
          <Route path="/languages" element={
              <ProtectedRoute>
                <LanguageSelection />
              </ProtectedRoute>
            } />
            <Route path="/quests/:languageCode" element={
              <ProtectedRoute>
                <LanguageQuests />
              </ProtectedRoute>
            } />
            <Route path="/quests/:questId" element={
            <ProtectedRoute>
              <QuestDetail />
            </ProtectedRoute>
          } />
          <Route path="/quests/:questId/play" element={
            <ProtectedRoute>
              <QuestPlay />
            </ProtectedRoute>
          } />
          <Route path="/quests/:questId/complete" element={
            <ProtectedRoute>
              <QuestComplete />
            </ProtectedRoute>
          } />
        </Routes>
          </QuestProvider>
          </AuthProvider>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
