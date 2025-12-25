// Translation system for ExploreSpeak
// Supports English, Portuguese (Brazilian), and Spanish (Mexican)

export type Language = 'en' | 'pt' | 'es';

export interface Translations {
  // Navigation
  nav: {
    exploreSpeak: string;
    dashboard: string;
    languages: string;
    quests: string;
    signOut: string;
    back: string;
  };
  
  // Dashboard
  dashboard: {
    welcomeBack: string;
    readyToContinue: string;
    browseLanguages: string;
    currentLevel: string;
    experiencePoints: string;
    currentStreak: string;
    days: string;
    startAdventure: string;
    chooseFrom: string;
    eachQuestIncludes: string;
    culturalContext: string;
    interactiveDialogue: string;
    vocabularyExercises: string;
    xpRewards: string;
    specializedTracks: string;
    clickBrowse: string;
  };
  
  // Language Selection
  languageSelection: {
    chooseYourJourney: string;
    selectLanguage: string;
    availableQuests: string;
    selectLanguageButton: string;
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  
  // Quest Pages
  quests: {
    availableAdventures: string;
    chooseQuest: string;
    noQuestsYet: string;
    workingOnQuests: string;
    checkBackSoon: string;
    exploreOtherLanguages: string;
    loading: string;
    loadingQuests: string;
    tryAgain: string;
    startQuest: string;
    estimatedTime: string;
    minutes: string;
    tommySpecialQuests: string;
    standardQuests: string;
    startWithTommy: string;
    level: string;
  };
  
  // Tommy Guide
  tommy: {
    meetYourGuide: string;
    currentQuest: string;
    quickPhrases: string;
    askTommy: string;
    typeQuestion: string;
    send: string;
    culturalTip: string;
    readyToHelp: string;
  };
  
  // Auth
  auth: {
    welcomeBack: string;
    signInToContinue: string;
    email: string;
    password: string;
    signIn: string;
    signingIn: string;
    dontHaveAccount: string;
    signUp: string;
    createAccount: string;
    joinExploreSpeak: string;
    name: string;
    confirmPassword: string;
    creatingAccount: string;
    alreadyHaveAccount: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
  };
  
  // Language Settings
  settings: {
    language: string;
    changeLanguage: string;
    interfaceLanguage: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      exploreSpeak: 'Explore Speak',
      dashboard: 'Dashboard',
      languages: 'Languages',
      quests: 'Quests',
      signOut: 'Sign Out',
      back: 'Back',
    },
    dashboard: {
      welcomeBack: 'Welcome back',
      readyToContinue: 'Ready to continue your language learning journey?',
      browseLanguages: 'Browse Languages',
      currentLevel: 'Current Level',
      experiencePoints: 'Experience Points',
      currentStreak: 'Current Streak',
      days: 'Days',
      startAdventure: 'Start Your Language Adventure!',
      chooseFrom: 'Choose from 8 language tracks including French, Portuguese, Italian, Japanese, Spanish, German, plus Portuguese to English and Spanish to English with Tommy as your guide!',
      eachQuestIncludes: 'Each quest includes:',
      culturalContext: 'Cultural context and learning objectives',
      interactiveDialogue: 'Interactive dialogue with AI guides (including Tommy! 🇧🇷🇲🇽)',
      vocabularyExercises: 'Vocabulary and grammar exercises',
      xpRewards: 'XP rewards and achievements',
      specializedTracks: 'Specialized tracks for Portuguese→English and Spanish→English',
      clickBrowse: 'Click Browse Languages above to get started!',
    },
    languageSelection: {
      chooseYourJourney: 'Choose Your Language Journey',
      selectLanguage: 'Select a language to explore available quests and start your learning adventure',
      availableQuests: 'quests available',
      selectLanguageButton: 'Select Language',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    quests: {
      availableAdventures: 'Available Adventures',
      chooseQuest: 'Choose a quest to begin your learning journey',
      noQuestsYet: 'No Quests Available Yet',
      workingOnQuests: "We're working on creating amazing quests for you!",
      checkBackSoon: 'Check back soon for new adventures.',
      exploreOtherLanguages: 'Explore Other Languages',
      loading: 'Loading',
      loadingQuests: 'Loading quests...',
      tryAgain: 'Try Again',
      startQuest: 'Start Quest',
      estimatedTime: 'min',
      minutes: 'minutes',
      tommySpecialQuests: "Tommy's Special Quests",
      standardQuests: 'Standard Quests',
      startWithTommy: 'Start with Tommy',
      level: 'Level',
    },
    tommy: {
      meetYourGuide: 'Meet Your Guide!',
      currentQuest: 'Current Quest',
      quickPhrases: 'Quick Phrases',
      askTommy: 'Ask Tommy Anything!',
      typeQuestion: 'Type your question here...',
      send: 'Send',
      culturalTip: 'Cultural Tip',
      readyToHelp: 'Ready to help!',
    },
    auth: {
      welcomeBack: 'Welcome Back!',
      signInToContinue: 'Sign in to continue your language learning journey',
      email: 'Email',
      password: 'Password',
      signIn: 'Sign In',
      signingIn: 'Signing in...',
      dontHaveAccount: "Don't have an account?",
      signUp: 'Sign up',
      createAccount: 'Create Account',
      joinExploreSpeak: 'Join ExploreSpeak and start your language learning adventure',
      name: 'Name',
      confirmPassword: 'Confirm Password',
      creatingAccount: 'Creating account...',
      alreadyHaveAccount: 'Already have an account?',
    },
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
    },
    settings: {
      language: 'Language',
      changeLanguage: 'Change Language',
      interfaceLanguage: 'Interface Language',
    },
  },
  
  pt: {
    nav: {
      exploreSpeak: 'Explore Speak',
      dashboard: 'Painel',
      languages: 'Idiomas',
      quests: 'Missões',
      signOut: 'Sair',
      back: 'Voltar',
    },
    dashboard: {
      welcomeBack: 'Bem-vindo de volta',
      readyToContinue: 'Pronto para continuar sua jornada de aprendizado de idiomas?',
      browseLanguages: 'Explorar Idiomas',
      currentLevel: 'Nível Atual',
      experiencePoints: 'Pontos de Experiência',
      currentStreak: 'Sequência Atual',
      days: 'Dias',
      startAdventure: 'Comece Sua Aventura de Idiomas!',
      chooseFrom: 'Escolha entre 8 trilhas de idiomas incluindo Francês, Português, Italiano, Japonês, Espanhol, Alemão, além de Português para Inglês e Espanhol para Inglês com Tommy como seu guia!',
      eachQuestIncludes: 'Cada missão inclui:',
      culturalContext: 'Contexto cultural e objetivos de aprendizado',
      interactiveDialogue: 'Diálogo interativo com guias de IA (incluindo Tommy! 🇧🇷🇲🇽)',
      vocabularyExercises: 'Exercícios de vocabulário e gramática',
      xpRewards: 'Recompensas de XP e conquistas',
      specializedTracks: 'Trilhas especializadas para Português→Inglês e Espanhol→Inglês',
      clickBrowse: 'Clique em Explorar Idiomas acima para começar!',
    },
    languageSelection: {
      chooseYourJourney: 'Escolha Sua Jornada de Idiomas',
      selectLanguage: 'Selecione um idioma para explorar missões disponíveis e começar sua aventura de aprendizado',
      availableQuests: 'missões disponíveis',
      selectLanguageButton: 'Selecionar Idioma',
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    },
    quests: {
      availableAdventures: 'Aventuras Disponíveis',
      chooseQuest: 'Escolha uma missão para começar sua jornada de aprendizado',
      noQuestsYet: 'Nenhuma Missão Disponível Ainda',
      workingOnQuests: 'Estamos trabalhando para criar missões incríveis para você!',
      checkBackSoon: 'Volte em breve para novas aventuras.',
      exploreOtherLanguages: 'Explorar Outros Idiomas',
      loading: 'Carregando',
      loadingQuests: 'Carregando missões...',
      tryAgain: 'Tentar Novamente',
      startQuest: 'Iniciar Missão',
      estimatedTime: 'min',
      minutes: 'minutos',
      tommySpecialQuests: 'Missões Especiais do Tommy',
      standardQuests: 'Missões Padrão',
      startWithTommy: 'Começar com Tommy',
      level: 'Nível',
    },
    tommy: {
      meetYourGuide: 'Conheça Seu Guia!',
      currentQuest: 'Missão Atual',
      quickPhrases: 'Frases Rápidas',
      askTommy: 'Pergunte Qualquer Coisa ao Tommy!',
      typeQuestion: 'Digite sua pergunta aqui...',
      send: 'Enviar',
      culturalTip: 'Dica Cultural',
      readyToHelp: 'Pronto para ajudar!',
    },
    auth: {
      welcomeBack: 'Bem-vindo de Volta!',
      signInToContinue: 'Entre para continuar sua jornada de aprendizado de idiomas',
      email: 'E-mail',
      password: 'Senha',
      signIn: 'Entrar',
      signingIn: 'Entrando...',
      dontHaveAccount: 'Não tem uma conta?',
      signUp: 'Cadastre-se',
      createAccount: 'Criar Conta',
      joinExploreSpeak: 'Junte-se ao ExploreSpeak e comece sua aventura de aprendizado de idiomas',
      name: 'Nome',
      confirmPassword: 'Confirmar Senha',
      creatingAccount: 'Criando conta...',
      alreadyHaveAccount: 'Já tem uma conta?',
    },
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Salvar',
      delete: 'Excluir',
      edit: 'Editar',
      close: 'Fechar',
    },
    settings: {
      language: 'Idioma',
      changeLanguage: 'Mudar Idioma',
      interfaceLanguage: 'Idioma da Interface',
    },
  },
  
  es: {
    nav: {
      exploreSpeak: 'Explore Speak',
      dashboard: 'Panel',
      languages: 'Idiomas',
      quests: 'Misiones',
      signOut: 'Cerrar Sesión',
      back: 'Volver',
    },
    dashboard: {
      welcomeBack: 'Bienvenido de nuevo',
      readyToContinue: '¿Listo para continuar tu viaje de aprendizaje de idiomas?',
      browseLanguages: 'Explorar Idiomas',
      currentLevel: 'Nivel Actual',
      experiencePoints: 'Puntos de Experiencia',
      currentStreak: 'Racha Actual',
      days: 'Días',
      startAdventure: '¡Comienza Tu Aventura de Idiomas!',
      chooseFrom: '¡Elige entre 8 rutas de idiomas incluyendo Francés, Portugués, Italiano, Japonés, Español, Alemán, además de Portugués a Inglés y Español a Inglés con Tommy como tu guía!',
      eachQuestIncludes: 'Cada misión incluye:',
      culturalContext: 'Contexto cultural y objetivos de aprendizaje',
      interactiveDialogue: 'Diálogo interactivo con guías de IA (¡incluyendo a Tommy! 🇧🇷🇲🇽)',
      vocabularyExercises: 'Ejercicios de vocabulario y gramática',
      xpRewards: 'Recompensas de XP y logros',
      specializedTracks: 'Rutas especializadas para Portugués→Inglés y Español→Inglés',
      clickBrowse: '¡Haz clic en Explorar Idiomas arriba para comenzar!',
    },
    languageSelection: {
      chooseYourJourney: 'Elige Tu Viaje de Idiomas',
      selectLanguage: 'Selecciona un idioma para explorar misiones disponibles y comenzar tu aventura de aprendizaje',
      availableQuests: 'misiones disponibles',
      selectLanguageButton: 'Seleccionar Idioma',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    },
    quests: {
      availableAdventures: 'Aventuras Disponibles',
      chooseQuest: 'Elige una misión para comenzar tu viaje de aprendizaje',
      noQuestsYet: 'No Hay Misiones Disponibles Todavía',
      workingOnQuests: '¡Estamos trabajando para crear misiones increíbles para ti!',
      checkBackSoon: 'Vuelve pronto para nuevas aventuras.',
      exploreOtherLanguages: 'Explorar Otros Idiomas',
      loading: 'Cargando',
      loadingQuests: 'Cargando misiones...',
      tryAgain: 'Intentar de Nuevo',
      startQuest: 'Iniciar Misión',
      estimatedTime: 'min',
      minutes: 'minutos',
      tommySpecialQuests: 'Misiones Especiales de Tommy',
      standardQuests: 'Misiones Estándar',
      startWithTommy: 'Comenzar con Tommy',
      level: 'Nivel',
    },
    tommy: {
      meetYourGuide: '¡Conoce a Tu Guía!',
      currentQuest: 'Misión Actual',
      quickPhrases: 'Frases Rápidas',
      askTommy: '¡Pregúntale Cualquier Cosa a Tommy!',
      typeQuestion: 'Escribe tu pregunta aquí...',
      send: 'Enviar',
      culturalTip: 'Consejo Cultural',
      readyToHelp: '¡Listo para ayudar!',
    },
    auth: {
      welcomeBack: '¡Bienvenido de Nuevo!',
      signInToContinue: 'Inicia sesión para continuar tu viaje de aprendizaje de idiomas',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      signIn: 'Iniciar Sesión',
      signingIn: 'Iniciando sesión...',
      dontHaveAccount: '¿No tienes una cuenta?',
      signUp: 'Regístrate',
      createAccount: 'Crear Cuenta',
      joinExploreSpeak: 'Únete a ExploreSpeak y comienza tu aventura de aprendizaje de idiomas',
      name: 'Nombre',
      confirmPassword: 'Confirmar Contraseña',
      creatingAccount: 'Creando cuenta...',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
    },
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      close: 'Cerrar',
    },
    settings: {
      language: 'Idioma',
      changeLanguage: 'Cambiar Idioma',
      interfaceLanguage: 'Idioma de la Interfaz',
    },
  },
};