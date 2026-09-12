import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/database';
import { formatCardDisplay } from '@/lib/card-utils';
import { ProfileCardDisplay } from '@/components/ProfileCardDisplay';
import { redirect, notFound } from 'next/navigation';

interface PageProps {
  params: {
    cardSlug: string;
  };
}

/**
 * Générer les métadonnées dynamiques pour SEO
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const card = await db.getCardBySlug(params.cardSlug);

  if (!card) {
    return {
      title: 'Carte non trouvée',
      description: 'Cette carte de visite n\'existe pas.',
    };
  }

  if (!card.isConfigured) {
    return {
      title: 'Carte non configurée',
      description: 'Cette carte de visite n\'est pas encore configurée.',
    };
  }

  return {
    title: `${card.fullName} - Carte de visite numérique`,
    description: card.bio || `${card.jobTitle} chez ${card.company}`,
    openGraph: {
      title: card.fullName,
      description: card.bio || `${card.jobTitle}`,
      type: 'website',
      images: card.profileImage ? [{ url: card.profileImage }] : [],
    },
  };
}

/**
 * Page publique d'affichage de la carte
 */
export default async function CardPage({ params }: PageProps) {
  try {
    const card = await db.getCardBySlug(params.cardSlug);

    // Carte non trouvée
    if (!card) {
      notFound();
    }

    // Carte non configurée - redirection vers la page admin si l'utilisateur est propriétaire
    if (!card.isConfigured) {
      // Optionnel: rediriger vers le dashboard avec un message
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Carte non configurée
            </h1>
            <p className="text-gray-600 mb-6">
              Cette carte de visite n'a pas encore été configurée par son propriétaire.
            </p>
            <a
              href="/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Se connecter
            </a>
          </div>
        </div>
      );
    }

    // Formater et afficher la carte
    const formattedCard = formatCardDisplay(card);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <ProfileCardDisplay card={formattedCard} />

          {/* Pied de page */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p>Carte de visite numérique créée avec TAPAM Card</p>
            <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">
              En créer une pour vous
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur lors de la récupération de la carte:', error);
    notFound();
  }
}
