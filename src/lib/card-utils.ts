/**
 * Utilitaires pour la gestion et l'affichage des cartes
 */

export interface CardDisplayData {
  id: string;
  cardNumber: string;
  slug: string;
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  profileImage: string | null;
  theme: 'Gold' | 'Silver' | 'Black';
  isConfigured: boolean;
  views: number;
  customButtons: Array<{
    id: string;
    label: string;
    url?: string;
    icon?: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardFormData {
  fullName: string;
  jobTitle: string;
  company: string;
  phone: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  theme: 'Gold' | 'Silver' | 'Black';
}

/**
 * Valider les données d'une carte
 */
export function validateCardData(data: Partial<CardFormData>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Le nom complet est requis';
  }

  if (!data.email?.trim()) {
    errors.email = 'L\'email est requis';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!data.jobTitle?.trim()) {
    errors.jobTitle = 'Le titre professionnel est requis';
  }

  if (!data.company?.trim()) {
    errors.company = 'La société est requise';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Numéro de téléphone invalide';
  }

  if (data.website && !isValidUrl(data.website)) {
    errors.website = 'URL invalide';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valider un email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valider un numéro de téléphone
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Valider une URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formater les données de carte pour l'affichage
 */
export function formatCardDisplay(card: any): CardDisplayData {
  return {
    id: card.id,
    cardNumber: card.cardNumber,
    slug: card.slug,
    fullName: card.fullName || '',
    jobTitle: card.jobTitle || '',
    company: card.company || '',
    phone: card.phone || '',
    email: card.email || '',
    bio: card.bio || '',
    location: card.location || '',
    website: card.website || '',
    profileImage: card.profileImage,
    theme: card.theme || 'Silver',
    isConfigured: card.isConfigured,
    views: card.views || 0,
    customButtons: (card.customButtons || []).sort((a: any, b: any) => a.order - b.order),
    createdAt: new Date(card.createdAt),
    updatedAt: new Date(card.updatedAt),
  };
}

/**
 * Obtenir les classes CSS de thème
 */
export function getThemeClasses(theme: 'Gold' | 'Silver' | 'Black'): {
  background: string;
  text: string;
  accent: string;
  button: string;
} {
  const themes = {
    Gold: {
      background: 'bg-amber-50',
      text: 'text-amber-900',
      accent: 'bg-amber-500',
      button: 'bg-amber-600 hover:bg-amber-700',
    },
    Silver: {
      background: 'bg-gray-50',
      text: 'text-gray-900',
      accent: 'bg-gray-400',
      button: 'bg-gray-600 hover:bg-gray-700',
    },
    Black: {
      background: 'bg-gray-900',
      text: 'text-white',
      accent: 'bg-gray-700',
      button: 'bg-black hover:bg-gray-900',
    },
  };

  return themes[theme] || themes.Silver;
}
