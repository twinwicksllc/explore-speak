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
        </Routes>
        </QuestProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
