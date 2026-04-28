// Multilingual support and localization service
export const LOCALIZATION_DATA = {
  supportedLanguages: [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      rtl: false,
      completion: 100,
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      rtl: false,
      completion: 95,
    },
    {
      code: 'es',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      rtl: false,
      completion: 90,
    },
    {
      code: 'fr',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      rtl: false,
      completion: 85,
    },
    {
      code: 'ar',
      name: 'Arabic',
      nativeName: 'العربية',
      flag: '🇸🇦',
      rtl: true,
      completion: 80,
    },
    {
      code: 'zh',
      name: 'Chinese',
      nativeName: '中文',
      flag: '🇨🇳',
      rtl: false,
      completion: 75,
    },
    {
      code: 'pt',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇧🇷',
      rtl: false,
      completion: 70,
    },
    {
      code: 'ru',
      name: 'Russian',
      nativeName: 'Русский',
      flag: '🇷🇺',
      rtl: false,
      completion: 65,
    },
    {
      code: 'ja',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      rtl: false,
      completion: 60,
    },
    {
      code: 'de',
      name: 'German',
      nativeName: 'Deutsch',
      flag: '🇩🇪',
      rtl: false,
      completion: 55,
    },
  ],
  translations: {
    en: {
      // General
      app_name: 'CIPSS',
      welcome: 'Welcome',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      close: 'Close',
      done: 'Done',
      retry: 'Retry',
      refresh: 'Refresh',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      settings: 'Settings',
      profile: 'Profile',
      home: 'Home',
      notifications: 'Notifications',
      help: 'Help',
      about: 'About',
      
      // Navigation
      dashboard: 'Dashboard',
      campaigns: 'Campaigns',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements',
      chat: 'Messages',
      learning: 'Learning',
      blockchain: 'Blockchain',
      
      // Dashboard
      welcome_back: 'Welcome back',
      your_impact: 'Your Impact',
      hours_volunteered: 'Hours Volunteered',
      campaigns_completed: 'Campaigns Completed',
      current_streak: 'Current Streak',
      recent_activities: 'Recent Activities',
      
      // Campaigns
      active_campaigns: 'Active Campaigns',
      campaign_details: 'Campaign Details',
      join_campaign: 'Join Campaign',
      leave_campaign: 'Leave Campaign',
      campaign_progress: 'Campaign Progress',
      participants: 'Participants',
      deadline: 'Deadline',
      location: 'Location',
      
      // Leaderboard
      top_volunteers: 'Top Volunteers',
      your_rank: 'Your Rank',
      points: 'Points',
      level: 'Level',
      weekly: 'Weekly',
      monthly: 'Monthly',
      all_time: 'All Time',
      
      // Achievements
      badges_earned: 'Badges Earned',
      achievement_unlocked: 'Achievement Unlocked',
      progress: 'Progress',
      completed: 'Completed',
      locked: 'Locked',
      
      // Learning
      learning_paths: 'Learning Paths',
      courses: 'Courses',
      enroll: 'Enroll',
      continue_learning: 'Continue Learning',
      certificate_earned: 'Certificate Earned',
      lesson_completed: 'Lesson Completed',
      
      // Blockchain
      blockchain_achievements: 'Blockchain Achievements',
      verify_achievement: 'Verify Achievement',
      nft_collection: 'NFT Collection',
      wallet_connected: 'Wallet Connected',
      reputation_score: 'Reputation Score',
      
      // Messages
      send_message: 'Send Message',
      type_message: 'Type a message',
      online: 'Online',
      offline: 'Offline',
      typing: 'Typing...',
      
      // Settings
      language: 'Language',
      theme: 'Theme',
      notifications_enabled: 'Notifications Enabled',
      privacy_settings: 'Privacy Settings',
      
      // Common phrases
      no_data_available: 'No data available',
      try_again_later: 'Please try again later',
      connection_error: 'Connection error',
      invalid_input: 'Invalid input',
      operation_successful: 'Operation successful',
      operation_failed: 'Operation failed',
    },
    
    hi: {
      // General
      app_name: 'CIPSS',
      welcome: 'स्वागत है',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      confirm: 'पुष्टि करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      view: 'देखें',
      back: 'पीछे',
      next: 'अगला',
      previous: 'पिछला',
      close: 'बंद करें',
      done: 'हो गया',
      retry: 'पुन: प्रयास करें',
      refresh: 'ताज़ा करें',
      search: 'खोजें',
      filter: 'फ़िल्टर',
      sort: 'छांटें',
      settings: 'सेटिंग्स',
      profile: 'प्रोफ़ाइल',
      home: 'होम',
      notifications: 'सूचनाएं',
      help: 'सहायता',
      about: 'के बारे में',
      
      // Navigation
      dashboard: 'डैशबोर्ड',
      campaigns: 'अभियान',
      leaderboard: 'लीडरबोर्ड',
      achievements: 'उपलब्धियां',
      chat: 'संदेश',
      learning: 'सीखना',
      blockchain: 'ब्लॉकचेन',
      
      // Dashboard
      welcome_back: 'वापसी पर स्वागत है',
      your_impact: 'आपका प्रभाव',
      hours_volunteered: 'स्वयंसेवक घंटे',
      campaigns_completed: 'पूर्ण अभियान',
      current_streak: 'वर्तमान निरंतरता',
      recent_activities: 'हाल की गतिविधियां',
      
      // Campaigns
      active_campaigns: 'सक्रिय अभियान',
      campaign_details: 'अभियान विवरण',
      join_campaign: 'अभियान में शामिल हों',
      leave_campaign: 'अभियान छोड़ें',
      campaign_progress: 'अभियान प्रगति',
      participants: 'प्रतिभागी',
      deadline: 'समय सीमा',
      location: 'स्थान',
      
      // Leaderboard
      top_volunteers: 'शीर्ष स्वयंसेवक',
      your_rank: 'आपकी रैंक',
      points: 'अंक',
      level: 'स्तर',
      weekly: 'साप्ताहिक',
      monthly: 'मासिक',
      all_time: 'सभी समय',
      
      // Achievements
      badges_earned: 'अर्जित बैज',
      achievement_unlocked: 'उपलब्धि अनलॉक हो गई',
      progress: 'प्रगति',
      completed: 'पूर्ण',
      locked: 'लॉक्ड',
      
      // Learning
      learning_paths: 'सीखने के मार्ग',
      courses: 'पाठ्यक्रम',
      enroll: 'नामांकन करें',
      continue_learning: 'सीखना जारी रखें',
      certificate_earned: 'प्रमाणपत्र अर्जित',
      lesson_completed: 'पाठ पूर्ण',
      
      // Blockchain
      blockchain_achievements: 'ब्लॉकचेन उपलब्धियां',
      verify_achievement: 'उपलब्धि सत्यापित करें',
      nft_collection: 'NFT संग्रह',
      wallet_connected: 'वॉलेट जुड़ा हुआ',
      reputation_score: 'प्रतिष्ठा स्कोर',
      
      // Messages
      send_message: 'संदेश भेजें',
      type_message: 'संदेश टाइप करें',
      online: 'ऑनलाइन',
      offline: 'ऑफलाइन',
      typing: 'टाइप कर रहे हैं...',
      
      // Settings
      language: 'भाषा',
      theme: 'थीम',
      notifications_enabled: 'सूचनाएं सक्षम',
      privacy_settings: 'गोपनीयता सेटिंग्स',
      
      // Common phrases
      no_data_available: 'कोई डेटा उपलब्ध नहीं',
      try_again_later: 'कृपया बाद में पुन: प्रयास करें',
      connection_error: 'कनेक्शन त्रुटि',
      invalid_input: 'अमान्य इनपुट',
      operation_successful: 'ऑपरेशन सफल',
      operation_failed: 'ऑपरेशन विफल',
    },
    
    es: {
      // General
      app_name: 'CIPSS',
      welcome: 'Bienvenido',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      close: 'Cerrar',
      done: 'Hecho',
      retry: 'Reintentar',
      refresh: 'Actualizar',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      settings: 'Configuración',
      profile: 'Perfil',
      home: 'Inicio',
      notifications: 'Notificaciones',
      help: 'Ayuda',
      about: 'Acerca de',
      
      // Navigation
      dashboard: 'Panel',
      campaigns: 'Campañas',
      leaderboard: 'Tabla de posiciones',
      achievements: 'Logros',
      chat: 'Mensajes',
      learning: 'Aprendizaje',
      blockchain: 'Blockchain',
      
      // Dashboard
      welcome_back: 'Bienvenido de nuevo',
      your_impact: 'Tu Impacto',
      hours_volunteered: 'Horas Voluntarias',
      campaigns_completed: 'Campañas Completadas',
      current_streak: 'Racha Actual',
      recent_activities: 'Actividades Recientes',
      
      // Campaigns
      active_campaigns: 'Campañas Activas',
      campaign_details: 'Detalles de la Campaña',
      join_campaign: 'Unirse a la Campaña',
      leave_campaign: 'Abandonar la Campaña',
      campaign_progress: 'Progreso de la Campaña',
      participants: 'Participantes',
      deadline: 'Fecha límite',
      location: 'Ubicación',
      
      // Leaderboard
      top_volunteers: 'Mejores Voluntarios',
      your_rank: 'Tu Rango',
      points: 'Puntos',
      level: 'Nivel',
      weekly: 'Semanal',
      monthly: 'Mensual',
      all_time: 'Todo el tiempo',
      
      // Achievements
      badges_earned: 'Insignias Obtenidas',
      achievement_unlocked: 'Logro Desbloqueado',
      progress: 'Progreso',
      completed: 'Completado',
      locked: 'Bloqueado',
      
      // Learning
      learning_paths: 'Rutas de Aprendizaje',
      courses: 'Cursos',
      enroll: 'Inscribirse',
      continue_learning: 'Continuar Aprendiendo',
      certificate_earned: 'Certificado Obtenido',
      lesson_completed: 'Lección Completada',
      
      // Blockchain
      blockchain_achievements: 'Logros Blockchain',
      verify_achievement: 'Verificar Logro',
      nft_collection: 'Colección NFT',
      wallet_connected: 'Billetera Conectada',
      reputation_score: 'Puntuación de Reputación',
      
      // Messages
      send_message: 'Enviar Mensaje',
      type_message: 'Escribe un mensaje',
      online: 'En línea',
      offline: 'Fuera de línea',
      typing: 'Escribiendo...',
      
      // Settings
      language: 'Idioma',
      theme: 'Tema',
      notifications_enabled: 'Notificaciones Activadas',
      privacy_settings: 'Configuración de Privacidad',
      
      // Common phrases
      no_data_available: 'No hay datos disponibles',
      try_again_later: 'Por favor inténtalo más tarde',
      connection_error: 'Error de conexión',
      invalid_input: 'Entrada inválida',
      operation_successful: 'Operación exitosa',
      operation_failed: 'Operación fallida',
    },
    
    fr: {
      // General
      app_name: 'CIPSS',
      welcome: 'Bienvenue',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Voir',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      close: 'Fermer',
      done: 'Terminé',
      retry: 'Réessayer',
      refresh: 'Actualiser',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      settings: 'Paramètres',
      profile: 'Profil',
      home: 'Accueil',
      notifications: 'Notifications',
      help: 'Aide',
      about: 'À propos',
      
      // Navigation
      dashboard: 'Tableau de bord',
      campaigns: 'Campagnes',
      leaderboard: 'Classement',
      achievements: 'Réalisations',
      chat: 'Messages',
      learning: 'Apprentissage',
      blockchain: 'Blockchain',
      
      // Dashboard
      welcome_back: 'Bon retour',
      your_impact: 'Votre Impact',
      hours_volunteered: 'Heures de Bénévolat',
      campaigns_completed: 'Campagnes Terminées',
      current_streak: 'Série Actuelle',
      recent_activities: 'Activités Récentes',
      
      // Campaigns
      active_campaigns: 'Campagnes Actives',
      campaign_details: 'Détails de la Campagne',
      join_campaign: 'Rejoindre la Campagne',
      leave_campaign: 'Quitter la Campagne',
      campaign_progress: 'Progrès de la Campagne',
      participants: 'Participants',
      deadline: 'Date limite',
      location: 'Lieu',
      
      // Leaderboard
      top_volunteers: 'Meilleurs Bénévoles',
      your_rank: 'Votre Rang',
      points: 'Points',
      level: 'Niveau',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
      all_time: 'Tout le temps',
      
      // Achievements
      badges_earned: 'Badges Obtenus',
      achievement_unlocked: 'Réalisation Débloquée',
      progress: 'Progrès',
      completed: 'Terminé',
      locked: 'Verrouillé',
      
      // Learning
      learning_paths: 'Parcours d\'Apprentissage',
      courses: 'Cours',
      enroll: 'S\'inscrire',
      continue_learning: 'Continuer l\'Apprentissage',
      certificate_earned: 'Certificat Obtenu',
      lesson_completed: 'Leçon Terminée',
      
      // Blockchain
      blockchain_achievements: 'Réalisations Blockchain',
      verify_achievement: 'Vérifier la Réalisation',
      nft_collection: 'Collection NFT',
      wallet_connected: 'Portefeuille Connecté',
      reputation_score: 'Score de Réputation',
      
      // Messages
      send_message: 'Envoyer un Message',
      type_message: 'Tapez un message',
      online: 'En ligne',
      offline: 'Hors ligne',
      typing: 'En train d\'écrire...',
      
      // Settings
      language: 'Langue',
      theme: 'Thème',
      notifications_enabled: 'Notifications Activées',
      privacy_settings: 'Paramètres de Confidentialité',
      
      // Common phrases
      no_data_available: 'Aucune donnée disponible',
      try_again_later: 'Veuillez réessayer plus tard',
      connection_error: 'Erreur de connexion',
      invalid_input: 'Entrée invalide',
      operation_successful: 'Opération réussie',
      operation_failed: 'Opération échouée',
    },
    
    ar: {
      // General
      app_name: 'CIPSS',
      welcome: 'مرحباً',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تحرير',
      view: 'عرض',
      back: 'رجوع',
      next: 'التالي',
      previous: 'السابق',
      close: 'إغلاق',
      done: 'تم',
      retry: 'إعادة المحاولة',
      refresh: 'تحديث',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      home: 'الرئيسية',
      notifications: 'الإشعارات',
      help: 'المساعدة',
      about: 'حول',
      
      // Navigation
      dashboard: 'لوحة التحكم',
      campaigns: 'الحملات',
      leaderboard: 'لوحة الصدارة',
      achievements: 'الإنجازات',
      chat: 'الرسائل',
      learning: 'التعلم',
      blockchain: 'بلوك تشين',
      
      // Dashboard
      welcome_back: 'مرحباً بعودتك',
      your_impact: 'أثرك',
      hours_volunteered: 'ساعات التطوع',
      campaigns_completed: 'الحملات المكتملة',
      current_streak: 'السلسلة الحالية',
      recent_activities: 'الأنشطة الأخيرة',
      
      // Campaigns
      active_campaigns: 'الحملات النشطة',
      campaign_details: 'تفاصيل الحملة',
      join_campaign: 'الانضمام للحملة',
      leave_campaign: 'مغادرة الحملة',
      campaign_progress: 'تقدم الحملة',
      participants: 'المشاركون',
      deadline: 'الموعد النهائي',
      location: 'الموقع',
      
      // Leaderboard
      top_volunteers: 'أفضل المتطوعين',
      your_rank: 'ترتيبك',
      points: 'النقاط',
      level: 'المستوى',
      weekly: 'أسبوعي',
      monthly: 'شهري',
      all_time: 'كل الوقت',
      
      // Achievements
      badges_earned: 'الشارات المكتسبة',
      achievement_unlocked: 'إنجاز مفتوح',
      progress: 'التقدم',
      completed: 'مكتمل',
      locked: 'مقفل',
      
      // Learning
      learning_paths: 'مسارات التعلم',
      courses: 'الدورات',
      enroll: 'التسجيل',
      continue_learning: 'متابعة التعلم',
      certificate_earned: 'شهادة مكتسبة',
      lesson_completed: 'درس مكتمل',
      
      // Blockchain
      blockchain_achievements: 'إنجازات البلوك تشين',
      verify_achievement: 'التحقق من الإنجاز',
      nft_collection: 'مجموعة NFT',
      wallet_connected: 'المحفظة متصلة',
      reputation_score: 'درجة السمعة',
      
      // Messages
      send_message: 'إرسال رسالة',
      type_message: 'اكتب رسالة',
      online: 'متصل',
      offline: 'غير متصل',
      typing: 'يكتب...',
      
      // Settings
      language: 'اللغة',
      theme: 'المظهر',
      notifications_enabled: 'الإشعارات مفعلة',
      privacy_settings: 'إعدادات الخصوصية',
      
      // Common phrases
      no_data_available: 'لا توجد بيانات متاحة',
      try_again_later: 'يرجى المحاولة مرة أخرى لاحقاً',
      connection_error: 'خطأ في الاتصال',
      invalid_input: 'إدخال غير صالح',
      operation_successful: 'العملية ناجحة',
      operation_failed: 'فشلت العملية',
    },
  },
  currentLanguage: 'en',
  fallbackLanguage: 'en',
  autoDetect: true,
  settings: {
    saveLanguagePreference: true,
    useDeviceLanguage: true,
    showLanguageSwitcher: true,
    enableRTL: true,
    dateFormat: 'auto', // auto, us, eu, iso
    timeFormat: 'auto', // auto, 12h, 24h
    numberFormat: 'auto', // auto, us, eu
    currency: 'USD',
  },
  analytics: {
    languageChanges: 45,
    mostUsedLanguage: 'en',
    languageDistribution: {
      en: 60,
      hi: 20,
      es: 10,
      fr: 5,
      ar: 3,
      others: 2,
    },
    translationRequests: 1250,
    missingTranslations: 23,
  },
};

export const getSupportedLanguages = () => {
  return LOCALIZATION_DATA.supportedLanguages;
};

export const getCurrentLanguage = () => {
  return LOCALIZATION_DATA.currentLanguage;
};

export const setCurrentLanguage = (languageCode) => {
  const language = LOCALIZATION_DATA.supportedLanguages.find(lang => lang.code === languageCode);
  
  if (!language) {
    return { success: false, message: 'Language not supported' };
  }
  
  LOCALIZATION_DATA.currentLanguage = languageCode;
  
  // Update analytics
  LOCALIZATION_DATA.analytics.languageChanges += 1;
  
  return { success: true, language };
};

export const getTranslation = (key, languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  
  // Try to get translation in target language
  if (LOCALIZATION_DATA.translations[targetLanguage] && 
      LOCALIZATION_DATA.translations[targetLanguage][key]) {
    return LOCALIZATION_DATA.translations[targetLanguage][key];
  }
  
  // Fallback to default language
  if (LOCALIZATION_DATA.translations[LOCALIZATION_DATA.fallbackLanguage] && 
      LOCALIZATION_DATA.translations[LOCALIZATION_DATA.fallbackLanguage][key]) {
    return LOCALIZATION_DATA.translations[LOCALIZATION_DATA.fallbackLanguage][key];
  }
  
  // Return key if no translation found
  return key;
};

export const translate = (key, params = {}, languageCode = null) => {
  let translation = getTranslation(key, languageCode);
  
  // Replace parameters in translation
  Object.keys(params).forEach(param => {
    translation = translation.replace(`{${param}}`, params[param]);
  });
  
  return translation;
};

export const getLanguageInfo = (languageCode) => {
  return LOCALIZATION_DATA.supportedLanguages.find(lang => lang.code === languageCode);
};

export const isRTLLanguage = (languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  const language = getLanguageInfo(targetLanguage);
  return language ? language.rtl : false;
};

export const getLocalizationSettings = () => {
  return LOCALIZATION_DATA.settings;
};

export const updateLocalizationSettings = (updates) => {
  LOCALIZATION_DATA.settings = { ...LOCALIZATION_DATA.settings, ...updates };
  return { success: true, settings: LOCALIZATION_DATA.settings };
};

export const detectDeviceLanguage = () => {
  // Simulate device language detection
  const deviceLanguages = ['en', 'hi', 'es', 'fr', 'ar'];
  const randomLanguage = deviceLanguages[Math.floor(Math.random() * deviceLanguages.length)];
  
  return {
    detected: randomLanguage,
    supported: LOCALIZATION_DATA.supportedLanguages.some(lang => lang.code === randomLanguage),
  };
};

export const setLanguageByDetection = () => {
  if (!LOCALIZATION_DATA.settings.useDeviceLanguage) {
    return { success: false, message: 'Auto-detection disabled' };
  }
  
  const detection = detectDeviceLanguage();
  
  if (detection.supported) {
    return setCurrentLanguage(detection.detected);
  }
  
  return { success: false, message: 'Device language not supported' };
};

export const formatDate = (date, format = null, languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  const targetFormat = format || LOCALIZATION_DATA.settings.dateFormat;
  
  const dateObj = new Date(date);
  
  // Format based on language and format settings
  if (targetFormat === 'us') {
    return dateObj.toLocaleDateString('en-US');
  } else if (targetFormat === 'eu') {
    return dateObj.toLocaleDateString('de-DE');
  } else if (targetFormat === 'iso') {
    return dateObj.toISOString().split('T')[0];
  } else {
    // Auto - use language locale
    return dateObj.toLocaleDateString(targetLanguage);
  }
};

export const formatTime = (date, format = null, languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  const targetFormat = format || LOCALIZATION_DATA.settings.timeFormat;
  
  const dateObj = new Date(date);
  
  if (targetFormat === '12h') {
    return dateObj.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (targetFormat === '24h') {
    return dateObj.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: false 
    });
  } else {
    // Auto - use language locale
    return dateObj.toLocaleTimeString(targetLanguage);
  }
};

export const formatNumber = (number, languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  
  return number.toLocaleString(targetLanguage);
};

export const formatCurrency = (amount, currency = null, languageCode = null) => {
  const targetLanguage = languageCode || LOCALIZATION_DATA.currentLanguage;
  const targetCurrency = currency || LOCALIZATION_DATA.settings.currency;
  
  return new Intl.NumberFormat(targetLanguage, {
    style: 'currency',
    currency: targetCurrency,
  }).format(amount);
};

export const getMissingTranslations = (languageCode) => {
  const targetTranslations = LOCALIZATION_DATA.translations[languageCode];
  const fallbackTranslations = LOCALIZATION_DATA.translations[LOCALIZATION_DATA.fallbackLanguage];
  
  if (!targetTranslations || !fallbackTranslations) {
    return [];
  }
  
  const missingKeys = [];
  
  Object.keys(fallbackTranslations).forEach(key => {
    if (!targetTranslations[key]) {
      missingKeys.push(key);
    }
  });
  
  return missingKeys;
};

export const addTranslation = (languageCode, key, value) => {
  if (!LOCALIZATION_DATA.translations[languageCode]) {
    LOCALIZATION_DATA.translations[languageCode] = {};
  }
  
  LOCALIZATION_DATA.translations[languageCode][key] = value;
  
  return { success: true };
};

export const updateTranslation = (languageCode, key, value) => {
  if (!LOCALIZATION_DATA.translations[languageCode]) {
    return { success: false, message: 'Language not found' };
  }
  
  LOCALIZATION_DATA.translations[languageCode][key] = value;
  
  return { success: true };
};

export const removeTranslation = (languageCode, key) => {
  if (!LOCALIZATION_DATA.translations[languageCode]) {
    return { success: false, message: 'Language not found' };
  }
  
  delete LOCALIZATION_DATA.translations[languageCode][key];
  
  return { success: true };
};

export const exportTranslations = (languageCode) => {
  const translations = LOCALIZATION_DATA.translations[languageCode];
  
  if (!translations) {
    return { success: false, message: 'Language not found' };
  }
  
  return {
    success: true,
    data: {
      language: languageCode,
      translations,
      exportedAt: new Date().toISOString(),
    },
  };
};

export const importTranslations = (languageCode, translations) => {
  if (!LOCALIZATION_DATA.translations[languageCode]) {
    LOCALIZATION_DATA.translations[languageCode] = {};
  }
  
  Object.keys(translations).forEach(key => {
    LOCALIZATION_DATA.translations[languageCode][key] = translations[key];
  });
  
  return { success: true };
};

export const getLocalizationAnalytics = () => {
  return LOCALIZATION_DATA.analytics;
};

export const updateLocalizationAnalytics = (updates) => {
  LOCALIZATION_DATA.analytics = { ...LOCALIZATION_DATA.analytics, ...updates };
  return { success: true, analytics: LOCALIZATION_DATA.analytics };
};

export const getLanguageProgress = (languageCode) => {
  const language = getLanguageInfo(languageCode);
  return language ? language.completion : 0;
};

export const getUntranslatedKeys = (languageCode) => {
  return getMissingTranslations(languageCode);
};

export const validateTranslations = (languageCode) => {
  const targetTranslations = LOCALIZATION_DATA.translations[languageCode];
  const fallbackTranslations = LOCALIZATION_DATA.translations[LOCALIZATION_DATA.fallbackLanguage];
  
  if (!targetTranslations || !fallbackTranslations) {
    return { valid: false, issues: ['Language or fallback not found'] };
  }
  
  const issues = [];
  const targetKeys = Object.keys(targetTranslations);
  const fallbackKeys = Object.keys(fallbackTranslations);
  
  // Check for missing translations
  fallbackKeys.forEach(key => {
    if (!targetTranslations[key]) {
      issues.push(`Missing translation: ${key}`);
    }
  });
  
  // Check for extra translations
  targetKeys.forEach(key => {
    if (!fallbackTranslations[key]) {
      issues.push(`Extra translation: ${key}`);
    }
  });
  
  // Check for empty translations
  Object.keys(targetTranslations).forEach(key => {
    if (!targetTranslations[key] || targetTranslations[key].trim() === '') {
      issues.push(`Empty translation: ${key}`);
    }
  });
  
  return {
    valid: issues.length === 0,
    issues,
    completion: Math.round(((targetKeys.length - issues.filter(i => i.includes('Missing')).length) / fallbackKeys.length) * 100),
  };
};

// Helper function to create a translation hook for React components
export const useTranslation = (languageCode = null) => {
  const currentLang = languageCode || LOCALIZATION_DATA.currentLanguage;
  
  return {
    t: (key, params = {}) => translate(key, params, currentLang),
    language: currentLang,
    isRTL: isRTLLanguage(currentLang),
    changeLanguage: setCurrentLanguage,
    formatDate: (date, format) => formatDate(date, format, currentLang),
    formatTime: (date, format) => formatTime(date, format, currentLang),
    formatNumber: (number) => formatNumber(number, currentLang),
    formatCurrency: (amount, currency) => formatCurrency(amount, currency, currentLang),
  };
};
