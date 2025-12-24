import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuest } from '../context/QuestContext';
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
  const [showExercise, setShowExercise] = useState(false);
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
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
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
  };

  const validateUserResponse = (userResponse: string, acceptableResponses: string[]): boolean => {
    const normalized = userResponse.toLowerCase().trim();
    return acceptableResponses.some(acceptable => 
      acceptable.toLowerCase().trim() === normalized ||
      normalized.includes(acceptable.toLowerCase().trim())
    );
  };

  const handleQuestComplete = () => {
    const completeMessage: Message = {
      id: 'complete',
      speaker: 'guide',
      text: '🎉 Congratulations! You\'ve completed the quest! Let\'s see how you did...',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, completeMessage]);
    
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

        {/* User Input */}
        {isUserTurn && (
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
