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
        name: 'Tommy Silva',
        origin: 'Rio de Janeiro, Brazil',
        avatar: '🇧🇷',
        personality: 'energetic and friendly',
        specialty: 'Brazilian Portuguese to English',
        intro: "Hey there! I'm Tommy from Rio! 🇧🇷 Let me help you master English while sharing Brazilian culture. I'll make learning fun with samba rhythms and Brazilian expressions!"
      };
    } else {
      return {
        name: 'Tommy Rodriguez',
        origin: 'Mexico City, Mexico',
        avatar: '🇲🇽',
        personality: 'warm and encouraging',
        specialty: 'Mexican Spanish to English',
        intro: "¡Hola amigos! I'm Tommy from Mexico City! 🇲🇽 I'll teach you English while we explore Mexican culture together. Get ready for some spicy learning adventures!"
      };
    }
  };

  const tommy = getTommyProfile();

  const samplePhrases = language === 'portuguese' ? [
    { phrase: "Como vai?", translation: "How are you?", tip: "Use 'How's it going?' for casual conversations!" },
    { phrase: "Muito obrigado!", translation: "Thank you very much!", tip: "In English, you can say 'Thanks a bunch!' informally." },
    { phrase: "Pode me ajudar?", translation: "Can you help me?", tip: "Try 'Could you give me a hand?' for a friendly approach." }
  ] : [
    { phrase: "¿Cómo estás?", translation: "How are you?", tip: "Use 'What's up?' for casual conversations!" },
    { phrase: "Muchas gracias!", translation: "Thank you very much!", tip: "In English, you can say 'Thanks a million!' informally." },
    { phrase: "¿Puedes ayudarme?", translation: "Can you help me?", tip: "Try 'Could you lend me a hand?' for a friendly approach." }
  ];

  const encouragementMessages = language === 'portuguese' ? [
    "Você está indo muito bem! Keep it up!",
    "Excelente trabalho! You're a natural!",
    "Continue assim! You're crushing it!",
    "Que progresso! Amazing job!"
  ] : [
    "¡Estás yendo muy bien! Keep it up!",
    "¡Excelente trabajo! You're a natural!",
    "¡Así se hace! You're crushing it!",
    "¡Qué progreso! Amazing job!"
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsTyping(true);
    const userMessage = message;
    setMessage('');

    // Simulate Tommy's response
    setTimeout(() => {
      const responses = [
        `Great question! ${userMessage}`,
        `I love your enthusiasm! Let me help you with that.`,
        `That's exactly what I was hoping you'd ask! Here's my advice...`,
        `¡Excelente! Let's break this down together.`
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
            <h4>Cultural Tip</h4>
            <p>
              {language === 'portuguese' 
                ? "In Brazil, we love to mix English words with Portuguese! 'Happy hour' is common, and we say 'OK' all the time. It's called 'Portunhol' - our special mix!"
                : "In Mexico, we love using English words in Spanish! We say 'okay', 'bye-bye', and 'marketing' like they're Spanish words. It's called 'Spanglish' and it's totally normal!"
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TommyGuide;