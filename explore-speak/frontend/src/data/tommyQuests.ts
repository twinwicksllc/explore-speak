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
    culturalContext: 'Brazilians are very warm and love to greet everyone! In America, especially Chicago, people will love your friendly Brazilian style. Tommy will help you share your Brazilian warmth while using natural American English expressions that Americans actually use!',
    tommyIntro: "Hey there! Welcome to your first English adventure! 🇺🇸 I'm Tommy from Chicago, and I'm so excited to help you learn English while keeping your amazing Brazilian spirit! Americans will love your friendly style - let's show them how Brazilians say hello, but in English!",
    exercises: [
      {
        type: 'translation',
        question: 'How would you say "E aí, tudo bem?" in casual American English?',
        options: ["Hello, how are you?", "Hey, what's up?", "Good morning", "Hi there"],
        correctAnswer: "Hey, what's up?",
        explanation: "Hey, what's up?' is perfect! Here in Chicago, we say this all the time - super friendly and casual!"
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
    culturalContext: 'Brazilian food is amazing! Americans are becoming more interested in Brazilian cuisine - feijoada, pão de queijo, brigadeiro... Tommy from Chicago will teach you how to share your culinary culture with Americans who might be trying Brazilian food for the first time!',
    tommyIntro: "Time to talk about food - both Brazilian and American! 🍲 I'm excited to teach you how to describe Brazilian dishes to Americans who've never tried them. And trust me, Chicagoans love good food - they'll be fascinated by feijoada and pão de queijo!",
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
    culturalContext: 'Mexicans are incredibly friendly and expressive! In America, especially Chicago, people will love your warm Mexican style. Tommy will teach you how to share your Mexican enthusiasm while using American English that feels natural and confident.',
    tommyIntro: "¡Hola amigos! Welcome to your English journey with me, Tommy from Chicago! 🇺🇸 I'm so excited to help you bring your amazing Mexican energy to American English! Chicagoans love Mexican culture, and I'll help you share your personality while speaking English like you've been here for years!",
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
    culturalContext: 'Mexican culture is rich and beautiful! Americans, especially in Chicago, are fascinated by Mexican traditions like Día de Muertos and posadas. Tommy from Chicago will teach you how to share your amazing Mexican heritage with Americans who are eager to learn!',
    tommyIntro: "Time to share your incredible Mexican culture with Americans! 🇲🇽 As someone who loves Mexican culture here in Chicago, I'm excited to teach you how to explain traditions like Día de Muertos to Americans who might be experiencing them for the first time. Let's show everyone how beautiful Mexican heritage is!",
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
    culturalContext: 'Brazilian professionals bring warmth and relationship-building skills that American companies love! Tommy from Chicago will help you adapt your Brazilian communication style to American business culture while keeping your natural charm and relationship-focused approach.',
    tommyIntro: "Let's get professional, Chicago style! 🏢 I'll help you bring your amazing Brazilian communication skills to American business. Brazilian professionals are valued here for your relationship-building approach - I'll teach you how to adapt that style for American workplaces while staying true to yourself!",
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