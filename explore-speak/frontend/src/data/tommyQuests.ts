// Tommy's Quest Data for Portuguese to English and Spanish to English

export interface TommyQuest {
  id: string;
  language: 'portuguese-to-english' | 'spanish-to-english';
  title: string;
  description: string;
  level: number;
  estimatedTime: number;
  category: string;
  objectives: string[];
  phrases: {
    original: string;
    translation: string;
    tip: string;
  }[];
  culturalContext: string;
  tommyIntro: string;
  exercises: {
    type: 'translation' | 'conversation' | 'cultural' | 'pronunciation';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}

export const tommyQuests: TommyQuest[] = [
  // Portuguese to English Quests
  {
    id: 'pt_en_basics_01',
    language: 'portuguese-to-english',
    title: 'Brazilian Greetings & Small Talk',
    description: 'Learn essential Brazilian greetings and how to make small talk in English',
    level: 1,
    estimatedTime: 15,
    category: 'Basic Conversation',
    objectives: [
      'Master Brazilian greeting expressions',
      'Learn small talk phrases',
      'Understand cultural nuances',
      'Practice pronunciation'
    ],
    phrases: [
      {
        original: 'E aí, tudo bem?',
        translation: "Hey, what's up / How are you?",
        tip: 'In Brazil, "E aí" is very casual. In English, "What\'s up?" is the equivalent!'
      },
      {
        original: 'Prazer em conhecer!',
        translation: 'Nice to meet you!',
        tip: 'You can also say "Great to meet you!" for more enthusiasm.'
      },
      {
        original: 'Tudo joia?',
        translation: "Is everything cool/alright?",
        tip: '"Joia" (jewel) means cool in Brazilian slang. "Is everything cool?" works perfectly!'
      }
    ],
    culturalContext: 'Brazilians are very warm and love to greet everyone! In Brazil, it\'s normal to greet strangers with a smile and friendly "Oi!". When learning English, Tommy will help you keep that Brazilian warmth while using natural English expressions.',
    tommyIntro: "Hey there! Welcome to your first English adventure! 🇧🇷 I'm Tommy from Rio, and I'm so excited to teach you English while we keep our Brazilian charm! Let's start with greetings - Brazilians love to say 'E aí!' and in English, you can say 'Hey there!' with the same energy!",
    exercises: [
      {
        type: 'translation',
        question: 'How would you say "E aí, tudo bem?" in casual English?',
        options: ["Hello, how are you?", "Hey, what's up?", "Good morning", "Hi there"],
        correctAnswer: "Hey, what's up?",
        explanation: "Hey, what's up?' captures the casual, friendly vibe of 'E aí, tudo bem?' perfectly!"
      },
      {
        type: 'conversation',
        question: 'You meet someone for the first time. What\'s a natural way to respond?',
        correctAnswer: "Nice to meet you! I'm [your name].",
        explanation: "'Nice to meet you!' is the standard friendly response when meeting someone new."
      },
      {
        type: 'cultural',
        question: 'True or False: In Brazil, it\'s normal to greet strangers on the street.',
        correctAnswer: 'True',
        explanation: 'True! Brazilians are very friendly and often greet strangers. Tommy will teach you how to do this naturally in English too!'
      }
    ]
  },
  {
    id: 'pt_en_food_01',
    language: 'portuguese-to-english',
    title: 'Brazilian Food & Restaurant English',
    description: 'Order food like a pro and talk about Brazilian cuisine in English',
    level: 2,
    estimatedTime: 20,
    category: 'Food & Dining',
    objectives: [
      'Learn restaurant vocabulary',
      'Practice ordering food',
      'Describe Brazilian dishes',
      'Cultural dining tips'
    ],
    phrases: [
      {
        original: 'Eu gostaria de um feijoada, por favor.',
        translation: 'I would like a feijoada, please.',
        tip: 'I\'d like is more polite than I want. Both work, but I\'d like sounds more natural!'
      },
      {
        original: 'A conta, por favor!',
        translation: 'The check, please!',
        tip: 'In American English, say "The check, please!" In British English, it\'s "The bill, please!"'
      },
      {
        original: 'Estava delicioso!',
        translation: 'It was delicious!',
        tip: 'You can also say "That was amazing!" or "Loved it!" for more enthusiasm.'
      }
    ],
    culturalContext: 'Brazilian food is amazing! Feijoada, pão de queijo, brigadeiro... Tommy will teach you how to talk about our delicious food in English and even explain what these dishes are to foreigners!',
    tommyIntro: "Time to talk about my favorite topic - food! 🍲 Brazilian food is the best in the world (I might be biased!), and I'll teach you how to order it and describe it perfectly in English. We'll even learn how to explain what feijoada is to your foreign friends!",
    exercises: [
      {
        type: 'translation',
        question: 'You want to order pão de queijo. What do you say?',
        options: ["I want pão de queijo", "I'd like pão de queijo", "Give me pão de queijo", "Pão de queijo please"],
        correctAnswer: "I'd like pão de queijo",
        explanation: "'I'd like' is the most polite and natural way to order food in English."
      },
      {
        type: 'conversation',
        question: 'Someone asks "How was the feijoada?" What\'s a great response?',
        correctAnswer: "It was absolutely delicious! You should try it.",
        explanation: 'Using enthusiastic words like "absolutely delicious" makes your conversation more engaging!'
      }
    ]
  },
  
  // Spanish to English Quests
  {
    id: 'es_en_basics_01',
    language: 'spanish-to-english',
    title: 'Mexican Greetings & Expressions',
    description: 'Learn Mexican-style greetings and expressions in English',
    level: 1,
    estimatedTime: 15,
    category: 'Basic Conversation',
    objectives: [
      'Master Mexican greeting styles',
      'Learn friendly expressions',
      'Understand Spanglish concepts',
      'Practice with cultural context'
    ],
    phrases: [
      {
        original: '¿Qué onda, güey?',
        translation: "What's up, dude?",
        tip: '"¿Qué onda?" is very Mexican! In English, "What\'s up?" or "What\'s happening?" works great.'
      },
      {
        original: '¡Órale!',
        translation: 'Wow! / Come on! / Let\'s go!',
        tip: '¡Órale! is super versatile! It can mean "Wow!", "Come on!", or "Let\'s go!" depending on context.'
      },
      {
        original: 'Está padrísimo',
        translation: 'It\'s awesome! / It\'s really cool!',
        tip: 'In Mexican Spanish, "padrísimo" means super cool. In English, "awesome" or "really cool" is perfect!'
      }
    ],
    culturalContext: 'Mexicans are incredibly friendly and expressive! We love to mix Spanish and English in our daily conversations - it\'s called Spanglish! Tommy will teach you how to keep that Mexican warmth while speaking natural English.',
    tommyIntro: "¡Hola amigos! Welcome to your English journey with your Mexican guide Tommy! 🇲🇽 I'm from Mexico City and I'm so excited to teach you English while keeping our Mexican flavor! We'll learn how to say '¿Qué onda?' in English and keep that friendly Mexican energy!",
    exercises: [
      {
        type: 'translation',
        question: 'How would you express "¡Órale, qué bueno!" in English?',
        options: ["Oh, very good!", "Wow, that's great!", "Oh my goodness", "That's nice"],
        correctAnswer: "Wow, that's great!",
        explanation: '"Wow, that\'s great!" captures the enthusiasm of "¡Órale, qué bueno!" perfectly!'
      },
      {
        type: 'conversation',
        question: 'Your friend shows you something cool. What\'s a Mexican-style response in English?',
        correctAnswer: "Whoa, that's awesome! Está padrísimo!",
        explanation: 'Mixing English with Spanish (Spanglish) is very natural for Mexican speakers learning English!'
      }
    ]
  },
  {
    id: 'es_en_cultural_01',
    language: 'spanish-to-english',
    title: 'Mexican Culture & Traditions in English',
    description: 'Learn to talk about Mexican culture, traditions, and celebrations in English',
    level: 2,
    estimatedTime: 25,
    category: 'Culture & Traditions',
    objectives: [
      'Explain Mexican holidays',
      'Describe traditions',
      'Share cultural insights',
      'Practice cultural conversations'
    ],
    phrases: [
      {
        original: 'Vamos a hacer posada',
        translation: "We're going to have a posada celebration",
        tip: 'A posada is a traditional Mexican Christmas celebration. You might need to explain it: "It\'s a traditional Christmas celebration with songs and food."'
      },
      {
        original: 'Feliz Día de Muertos',
        translation: 'Happy Day of the Dead',
        tip: 'Day of the Dead is the English name, but you should explain it: "It\'s a beautiful Mexican holiday where we honor our ancestors."'
      },
      {
        original: 'Viva México!',
        translation: 'Long live Mexico!',
        tip: 'This is the perfect translation! You can also say "Go Mexico!" in sports contexts.'
      }
    ],
    culturalContext: 'Mexican culture is rich and beautiful! From Día de Muertos to posadas, we have amazing traditions. Tommy will teach you how to share these wonderful cultural aspects with the world in English while keeping our Mexican pride!',
    tommyIntro: "Time to show the world how amazing Mexican culture is! 🇲🇽 I'll teach you how to explain our traditions like Día de Muertos, posadas, and more in English. We'll keep our Mexican pride while sharing our culture with everyone!",
    exercises: [
      {
        type: 'conversation',
        question: 'Someone asks "What is Day of the Dead?" How do you explain it?',
        correctAnswer: "It's a beautiful Mexican holiday where we honor and celebrate our ancestors who have passed away.",
        explanation: 'Explaining cultural concepts clearly helps others understand and appreciate your culture!'
      },
      {
        type: 'cultural',
        question: 'True or False: Mexicans often mix English words when speaking Spanish.',
        correctAnswer: 'True',
        explanation: 'True! This is called Spanglish and is very common. Tommy will help you master both languages!'
      }
    ]
  },
  
  // Advanced Quests
  {
    id: 'pt_en_business_01',
    language: 'portuguese-to-english',
    title: 'Professional English for Brazilians',
    description: 'Learn business English and professional communication skills',
    level: 3,
    estimatedTime: 30,
    category: 'Professional',
    objectives: [
      'Master business vocabulary',
      'Professional email writing',
      'Meeting participation',
      'Networking skills'
    ],
    phrases: [
      {
        original: 'Eu gostaria de agendar uma reunião',
        translation: 'I would like to schedule a meeting',
        tip: 'In business English, "schedule" is more common than "book" for meetings.'
      },
      {
        original: 'Pode me enviar um e-mail com os detalhes?',
        translation: 'Could you send me an email with the details?',
        tip: 'Using "Could you" is more polite than "Can you" in business contexts.'
      }
    ],
    culturalContext: 'Brazilian professionals are known for being warm and relationship-focused. Tommy will teach you how to maintain that Brazilian warmth while being professional in English business contexts.',
    tommyIntro: "Let's get professional! 🏢 Brazilian professionals are conquering the world, and I'll help you communicate with confidence in international business. We'll learn how to write emails, participate in meetings, and network while keeping our Brazilian charm!",
    exercises: [
      {
        type: 'conversation',
        question: 'You want to suggest a meeting time. What\'s professional to say?',
        correctAnswer: "Would you be available to meet sometime next week?",
        explanation: 'Using "Would you be available" is polite and professional in business contexts.'
      }
    ]
  }
];

// Helper function to get quests by language
export const getTommyQuestsByLanguage = (language: string) => {
  return tommyQuests.filter(quest => quest.language === language);
};

// Helper function to get quest by ID
export const getTommyQuestById = (id: string) => {
  return tommyQuests.find(quest => quest.id === id);
};