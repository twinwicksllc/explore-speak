import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QuestProvider } from './context/QuestContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ConfirmEmail from './components/auth/ConfirmEmail';
import Dashboard from './pages/Dashboard';
import QuestList from './pages/QuestList';
import QuestDetail from './pages/QuestDetail';
import QuestPlay from './pages/QuestPlay';
import QuestComplete from './pages/QuestComplete';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
