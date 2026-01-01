export type Language = 'en' | 'fr';

// Translation dictionary
const translations = {
  en: {
    nav: {
      home: 'Home',
      events: 'Events',
      discussions: 'Discussions',
      newsletter: 'Newsletter',
      admin: 'Admin'
    },
    common: {
      welcome: 'Welcome to LocalPulse Canada',
      subtitle: 'Discover local events and community discussions across Canadian cities',
      viewAll: 'View All',
      readMore: 'Read More',
      submit: 'Submit',
      cancel: 'Cancel',
      loading: 'Loading...'
    },
    cities: {
      toronto: 'Toronto',
      montreal: 'Montreal',
      vancouver: 'Vancouver',
      calgary: 'Calgary',
      ottawa: 'Ottawa',
      edmonton: 'Edmonton'
    },
    categories: {
      community: 'Community',
      sports: 'Sports',
      arts: 'Arts & Culture',
      food: 'Food & Drink',
      education: 'Education',
      business: 'Business'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      events: 'Événements',
      discussions: 'Discussions',
      newsletter: 'Bulletin',
      admin: 'Administration'
    },
    common: {
      welcome: 'Bienvenue à LocalPulse Canada',
      subtitle: 'Découvrez des événements locaux et des discussions communautaires dans les villes canadiennes',
      viewAll: 'Voir Tout',
      readMore: 'Lire Plus',
      submit: 'Soumettre',
      cancel: 'Annuler',
      loading: 'Chargement...'
    },
    cities: {
      toronto: 'Toronto',
      montreal: 'Montréal',
      vancouver: 'Vancouver',
      calgary: 'Calgary',
      ottawa: 'Ottawa',
      edmonton: 'Edmonton'
    },
    categories: {
      community: 'Communauté',
      sports: 'Sports',
      arts: 'Arts et Culture',
      food: 'Nourriture et Boissons',
      education: 'Éducation',
      business: 'Affaires'
    }
  }
};

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        value = value[k];
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Helper to get city name in current language
export function getCityName(lang: Language, cityKey: string): string {
  return getTranslation(lang, `cities.${cityKey}`);
}

// Helper to get category name in current language
export function getCategoryName(lang: Language, categoryKey: string): string {
  return getTranslation(lang, `categories.${categoryKey}`);
}