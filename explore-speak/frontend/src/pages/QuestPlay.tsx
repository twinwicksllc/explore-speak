import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
import * as questService from '../services/questService';
import ExerciseCard from '../components/exercises/ExerciseCard';
import './QuestPlay.css';

interface Message {
  id: string;
  speaker: 'guide' | 'npc' | 'user';
  text: string;
  characterName?: string;
  translation?: string;
  timestamp: Date;
}

const QuestPlay: React.FC = () => {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentQuest, loading, error, fetchQuestById } = useQuest();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [showHint, setShowHint] = useState(false);
  const [teachingPhrase, setTeachingPhrase] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load quest data
  useEffect(() => {
    if (questId && user?.userId) {
      fetchQuestById(questId, user.userId);
    }
  }, [questId, user, fetchQuestById]);

  // Initialize quest with guide intro
  useEffect(() => {
    if (currentQuest?.quest?.questDialogue?.scenario && !isInitialized) {
      setIsInitialized(true);
      const scenario = currentQuest.quest.questDialogue.scenario;
      const guideIntro: Message = {
        id: 'intro',
        speaker: 'guide',
        text: scenario.guideIntro,
        timestamp: new Date(),
      };
      setMessages([guideIntro]);
      
      // Start with first dialogue step
      setTimeout(() => {
        processNextStep(0);
      }, 1000);
    }
  }, [currentQuest, isInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processNextStep = (stepIndex: number) => {
    try {
    if (!currentQuest?.quest?.questDialogue?.dialogueSteps) return;
    
    const steps = currentQuest.quest.questDialogue.dialogueSteps;
    if (stepIndex >= steps.length) {
      // Quest dialogue complete
      handleQuestComplete();
      return;
    }

    const step = steps[stepIndex];
    
    if (step.speaker === 'guide') {
      // Guide message
      const guideMessage: Message = {
        id: `step-${step.stepId}`,
        speaker: 'guide',
        text: step.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, guideMessage]);
      setCurrentStepIndex(stepIndex + 1);
      
      // Auto-advance to next step after a delay
      setTimeout(() => {
        processNextStep(stepIndex + 1);
      }, 2000);
      
    } else if (step.speaker === 'npc') {
      // NPC message
      const npcMessage: Message = {
        id: `step-${step.stepId}`,
        speaker: 'npc',
        text: step.message,
        characterName: step.characterName,
        translation: step.translation,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, npcMessage]);
      setCurrentStepIndex(stepIndex + 1);
      
      // Auto-advance to next step after a delay
      setTimeout(() => {
        processNextStep(stepIndex + 1);
      }, 2000);
      
    } else if (step.speaker === 'exercise') {
      // Show exercise
      if (step.exercise) {
        setCurrentExercise(step.exercise);
        setCurrentStepIndex(stepIndex);
      }
    } else if (step.speaker === 'user_prompt') {
      // First, teach the phrase
      const phraseToTeach = step.acceptableResponses?.[0];
      if (phraseToTeach) {
        const teachMessage: Message = {
          id: `teach-${step.stepId}`,
          speaker: 'guide',
          text: `Let me teach you how to say this. Repeat after me: "${phraseToTeach}"`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, teachMessage]);
        setTeachingPhrase(phraseToTeach);
      }
      // Wait for user input
      setCurrentStepIndex(stepIndex);
      // User input form is already visible
    }
    } catch (error) {
      console.error('Error processing step:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        speaker: 'guide',
        text: 'Something went wrong. Let me try to continue...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      // Try to continue to next step
      if (stepIndex + 1 < (currentQuest?.quest?.questDialogue?.steps?.length || 0)) {
        setTimeout(() => processNextStep(stepIndex + 1), 2000);
      }
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);
    
    try {
    
    // Add user message to chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: userInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Get current step
    const steps = currentQuest?.quest?.questDialogue?.dialogueSteps;
    const currentStep = steps?.[currentStepIndex];
    
    // Validate user response (simple check for now)
    const isCorrect = validateUserResponse(userInput, currentStep?.acceptableResponses || []);
    
    // Show feedback
    setTimeout(() => {
      const feedbackMessage: Message = {
        id: `feedback-${Date.now()}`,
        speaker: 'guide',
        text: isCorrect 
          ? '✅ Perfect! Well done!' 
          : `Good try! The correct answer is: "${currentStep?.acceptableResponses?.[0]}"`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, feedbackMessage]);
      
      setUserInput('');
      setIsProcessing(false);
      setShowHint(false);
      setTeachingPhrase(null);
      
      // Move to next step
      setTimeout(() => {
        processNextStep(currentStepIndex + 1);
      }, 1500);
    }, 1000);
    } catch (error) {
      console.error('Error processing user response:', error);
      setIsProcessing(false);
      // Show error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        speaker: 'guide',
        text: 'Oops! Something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };  // Normalize text by removing accents and special characters
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, ''); // Remove special chars except spaces
  };

  const validateUserResponse = (userResponse: string, acceptableResponses: string[]): boolean => {
    const normalized = normalizeText(userResponse);
    return acceptableResponses.some(acceptable => {
      const normalizedAcceptable = normalizeText(acceptable);
      return normalized === normalizedAcceptable || normalized.includes(normalizedAcceptable);
    });
  };

  const handleQuestComplete = async () => {
    const completeMessage: Message = {
      id: 'complete',
      speaker: 'guide',
      text: '🎉 Congratulations! You\'ve completed the quest! Let\'s see how you did...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, completeMessage]);
    
    // Calculate score (simple: 100% for now, will improve with exercises)
    const score = 100;
    
    // Save completion to backend
    if (questId && user?.userId) {
      try {
        await questService.completeQuest(questId, user.userId, score);
      } catch (error) {
        console.error('Failed to save quest completion:', error);
      }
    }
    
    // Navigate to completion page after a delay
    setTimeout(() => {
      navigate(`/quests/${questId}/complete`);
    }, 3000);
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be saved.')) {
      navigate('/quests');
    }
  };

  if (loading) {
    return (
      <div className="quest-play-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading quest...</p>
        </div>
      </div>
    );
  }

  if (error || !currentQuest) {
    return (
      <div className="quest-play-container">
        <div className="error-state">
          <h2>❌ Error</h2>
          <p>{error || 'Quest not found'}</p>
          <button onClick={() => navigate('/quests')} className="back-button">
            ← Back to Quests
          </button>
        </div>
      </div>
    );
  }

  const quest = currentQuest.quest;
  const currentStep = quest.questDialogue?.dialogueSteps?.[currentStepIndex];
  const isUserTurn = currentStep?.speaker === 'user_prompt';

  return (
    <div className="quest-play-container">
      {/* Header */}
      <header className="quest-play-header">
        <div className="header-left">
          <h1 className="quest-title">{quest.title}</h1>
        </div>
        <div className="header-right">
          <button onClick={handleExit} className="exit-button">
            ✕ Exit Quest
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="quest-play-main">
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message message-${message.speaker}`}>
              {message.speaker === 'guide' && (
                <div className="message-avatar">🧑‍🏫</div>
              )}
              {message.speaker === 'npc' && (
                <div className="message-avatar">👤</div>
              )}
              <div className="message-content">
                {message.characterName && (
                  <div className="message-name">{message.characterName}</div>
                )}
                <div className="message-text">{message.text}</div>
                {message.translation && (
                  <div className="message-translation">({message.translation})</div>
                )}
              </div>
              {message.speaker === 'user' && (
                <div className="message-avatar">👨‍🎓</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Exercise */}
        {currentExercise && (
          <ExerciseCard
            exercise={currentExercise}
            onComplete={(isCorrect) => {
              // Add feedback message
              const feedbackMsg: Message = {
                id: `exercise-feedback-${Date.now()}`,
                speaker: 'guide',
                text: isCorrect 
                  ? '✅ Excellent work! You got it right!' 
                  : '💪 Good try! Keep practicing and you\'ll get it next time.',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, feedbackMsg]);
              setCurrentExercise(null);
              
              // Move to next step
              setTimeout(() => {
                processNextStep(currentStepIndex + 1);
              }, 1500);
            }}
          />
        )}

        {/* User Input */}
        {isUserTurn && !currentExercise && (
          <div className="input-area">
            <div className="input-prompt">
              {currentStep?.userPrompt}
            </div>
            
            {/* Teaching Phrase Display */}
            {teachingPhrase && (
              <div className="teaching-phrase">
                <div className="phrase-label">📝 Phrase to learn:</div>
                <div className="phrase-text">{teachingPhrase}</div>
              </div>
            )}
            
            {/* Hint Button */}
            <div className="hint-section">
              <button 
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="hint-button"
              >
                💡 {showHint ? 'Hide' : 'Show'} Hint
              </button>
              {showHint && teachingPhrase && (
                <div className="hint-box">
                  <strong>Hint:</strong> Try typing: <code>{teachingPhrase}</code>
                </div>
              )}
            </div>
            
            <form onSubmit={handleUserSubmit} className="input-form">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your response..."
                className="input-field"
                disabled={isProcessing}
                autoFocus
              />
              <button 
                type="submit" 
                className="submit-button"
                disabled={!userInput.trim() || isProcessing}
              >
                {isProcessing ? '...' : 'Send'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestPlay;
