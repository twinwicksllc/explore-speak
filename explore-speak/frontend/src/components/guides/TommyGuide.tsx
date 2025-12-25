import React, { useState } from 'react';
import './TommyGuide.css';

interface TommyGuideProps {
  language: 'portuguese' | 'spanish';
  onMessage?: (message: string) => void;
  introduction?: string;
  currentLevel?: number;
  questTitle?: string;
}

const TommyGuide: React.FC<TommyGuideProps> = ({ 
  language, 
  onMessage, 
  introduction,
  currentLevel = 1,
  questTitle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const getTommyProfile = () => {
    if (language === 'portuguese') {
      return {
        name: 'Tommy O\'Malley',
        origin: 'Chicago, Illinois',
        avatar: '🇺🇸',
        personality: 'welcoming and friendly',
        specialty: 'English for Portuguese Speakers',
        intro: "Hey there! I'm Tommy from Chicago! 🇺🇸 I'm excited to help you learn English and feel at home in America. I'll show you how to share your Brazilian culture while speaking natural English - maybe even teach you some Chicago slang along the way!"
      };
    } else {
      return {
        name: 'Tommy O\'Malley',
        origin: 'Chicago, Illinois',
        avatar: '🇺🇸',
        personality: 'welcoming and encouraging',
        specialty: 'English for Spanish Speakers',
        intro: "¡Hola amigos! I'm Tommy from Chicago! 🇺🇸 I'm thrilled to help you master English and welcome you to American culture. Together, we'll keep your Mexican heritage alive while you speak English confidently - Chicago style!"
      };
    }
  };

  const tommy = getTommyProfile();

  const samplePhrases = language === 'portuguese' ? [
    { phrase: "Como vai?", translation: "How are you?", tip: "In Chicago, we say 'How's it going?' - super casual and friendly!" },
    { phrase: "Muito obrigado!", translation: "Thank you very much!", tip: "Try 'Thanks a bunch!' or 'I really appreciate it!' - very Midwestern!" },
    { phrase: "Pode me ajudar?", translation: "Can you help me?", tip: "Chicago folks say 'Could you give me a hand?' - we're always helpful!" }
  ] : [
    { phrase: "¿Cómo estás?", translation: "How are you?", tip: "In Chicago, we love 'How's it going?' - very welcoming!" },
    { phrase: "Muchas gracias!", translation: "Thank you very much!", tip: "Try 'Thanks a ton!' or 'I really appreciate it!' - Chicago style!" },
    { phrase: "¿Puedes ayudarme?", translation: "Can you help me?", tip: "Say 'Could you lend me a hand?' - Chicagoans are super friendly!" }
  ];

  const encouragementMessages = language === 'portuguese' ? [
    "Você está indo muito bem! Keep it up, my friend!",
    "Excelente trabalho! You're doing great - Chicago style!",
    "Continue assim! You're crushing it!",
    "Que progresso! Amazing job - you got this!"
  ] : [
    "¡Estás yendo muy bien! Keep it up, my friend!",
    "¡Excelente trabajo! You're doing great - Chicago style!",
    "¡Así se hace! You're crushing it!",
    "¡Qué progreso! Amazing job - you got this!"
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsTyping(true);
    const userMessage = message;
    setMessage('');

    // Simulate Tommy's response
    setTimeout(() => {
      const responses = [
        `Great question! ${userMessage} - Chicago style!`,
        `I love your enthusiasm! Let me help you with that, my friend.`,
        `That's exactly what I was hoping you'd ask! Here in Chicago, we'd say...`,
        `¡Excelente! Let's break this down together. You're doing amazing!`
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      if (onMessage) {
        onMessage(randomResponse);
      }
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`tommy-guide ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Tommy Avatar and Basic Info */}
      <div className="tommy-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="tommy-avatar">
          <span className="tommy-flag">{tommy.avatar}</span>
          <div className="tommy-face">😊</div>
        </div>
        <div className="tommy-info">
          <h3 className="tommy-name">{tommy.name}</h3>
          <p className="tommy-origin">{tommy.origin}</p>
          <div className="tommy-status">
            <span className="status-dot"></span>
            <span className="status-text">Ready to help!</span>
          </div>
        </div>
        <button className="expand-button">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="tommy-content">
          {/* Introduction */}
          <div className="tommy-intro">
            <h4>Meet Your Guide!</h4>
            <p>{introduction || tommy.intro}</p>
          </div>

          {/* Current Quest Info */}
          {questTitle && (
            <div className="current-quest">
              <h4>Current Quest</h4>
              <p className="quest-title">{questTitle}</p>
              <div className="level-progress">
                <span>Level {currentLevel}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${Math.min(currentLevel * 20, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Phrase Helper */}
          <div className="phrase-helper">
            <h4>Quick Phrases</h4>
            <div className="phrases-list">
              {samplePhrases.map((item, index) => (
                <div key={index} className="phrase-item">
                  <div className="phrase-original">{item.phrase}</div>
                  <div className="phrase-translation">→ {item.translation}</div>
                  <div className="phrase-tip">💡 {item.tip}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Encouragement */}
          <div className="encouragement">
            <div className="encouragement-text">
              {encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="tommy-chat">
            <h4>Ask Tommy Anything!</h4>
            <div className="chat-input">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question here..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isTyping || !message.trim()}
                className="send-button"
              >
                {isTyping ? '...' : 'Send'}
              </button>
            </div>
          </div>

          {/* Cultural Tips */}
          <div className="cultural-tips">
            <h4>American Cultural Tip</h4>
            <p>
              {language === 'portuguese' 
                ? "In America, especially Chicago, we love cultural diversity! People will be fascinated by your Brazilian culture. Don't be afraid to share words like 'saudade' - we think it's beautiful! And Chicagoans love learning about Brazilian food and music!"
                : "In America, especially Chicago, we celebrate Mexican culture every day! People will love hearing about your traditions. Don't hesitate to share Mexican expressions - Chicago has the best Mexican food outside Mexico! We're proud of our diversity."
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TommyGuide;