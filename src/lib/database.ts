import { prisma } from './prisma';

/**
 * Service de base de données centralisé
 * Toutes les opérations DB passent par ici pour une cohérence garantie
 */
export const db = {
  /**
   * Récupérer un utilisateur avec sa carte
   */
  getUserWithCard: async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        card: {
          include: {
            customButtons: true,
          },
        },
      },
    });
  },

  /**
   * Récupérer une carte par son slug (pour affichage public)
   */
  getCardBySlug: async (slug: string) => {
    return prisma.card.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        customButtons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  },

  /**
   * Récupérer une carte par son ID
   */
  getCardById: async (cardId: string) => {
    return prisma.card.findUnique({
      where: { id: cardId },
      include: {
        user: true,
        customButtons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  },

  /**
   * Créer une nouvelle carte
   */
  createCard: async (data: {
    userId: string;
    cardNumber: string;
    slug: string;
    isConfigured: boolean;
  }) => {
    return prisma.card.create({
      data,
      include: {
        customButtons: true,
      },
    });
  },

  /**
   * Mettre à jour les données de la carte
   */
  updateCard: async (cardId: string, data: any) => {
    return prisma.card.update({
      where: { id: cardId },
      data,
      include: {
        customButtons: {
          orderBy: { order: 'asc' },
        },
      },
    });
  },

  /**
   * Incrémenter le compteur de consultations
   */
  incrementViewCount: async (cardId: string) => {
    return prisma.card.update({
      where: { id: cardId },
      data: { views: { increment: 1 } },
    });
  },

  /**
   * Récupérer tous les boutons personnalisés d'une carte
   */
  getCustomButtons: async (cardId: string) => {
    return prisma.customButton.findMany({
      where: { cardId },
      orderBy: { order: 'asc' },
    });
  },

  /**
   * Ajouter un bouton personnalisé
   */
  createCustomButton: async (data: {
    cardId: string;
    label: string;
    url?: string;
    icon?: string;
    order: number;
  }) => {
    return prisma.customButton.create({ data });
  },

  /**
   * Mettre à jour un bouton personnalisé
   */
  updateCustomButton: async (buttonId: string, data: any) => {
    return prisma.customButton.update({
      where: { id: buttonId },
      data,
    });
  },

  /**
   * Supprimer un bouton personnalisé
   */
  deleteCustomButton: async (buttonId: string) => {
    return prisma.customButton.delete({
      where: { id: buttonId },
    });
  },

  /**
   * Récupérer un utilisateur par son identifiant
   */
  getUserByIdentifier: async (identifier: string) => {
    return prisma.user.findUnique({
      where: { identifier },
      include: {
        card: {
          include: {
            customButtons: true,
          },
        },
      },
    });
  },
};
