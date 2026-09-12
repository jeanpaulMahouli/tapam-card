'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/lib/database';
import { ProfileFormEditor } from '@/components/ProfileFormEditor';
import { ProfileCardDisplay } from '@/components/ProfileCardDisplay';
import { formatCardDisplay, CardFormData, CardDisplayData } from '@/lib/card-utils';

/**
 * Page de gestion du profil utilisateur
 */
export default function ProfilePage() {
  const router = useRouter();
  const [card, setCard] = useState<CardDisplayData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadCard();
  }, []);

  /**
   * Charger la carte de l'utilisateur
   */
  const loadCard = async () => {
    try {
      setIsLoading(true);
      const session = await getSession();

      if (!session?.user?.id) {
        router.push('/login');
        return;
      }

      const userData = await db.getUserWithCard(session.user.id);
      if (!userData?.card) {
        setError('Aucune carte trouvée');
        return;
      }

      setCard(formatCardDisplay(userData.card));
    } catch (err) {
      setError('Erreur lors du chargement de la carte');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sauvegarder les modifications de la carte
   */
  const handleSaveProfile = async (formData: CardFormData) => {
    if (!card) return;

    try {
      setIsSaving(true);

      const response = await fetch(`/api/cards/${card.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || 'Erreur lors de la sauvegarde'
        );
      }

      const updatedCard = await response.json();
      setCard(formatCardDisplay(updatedCard));
    } catch (err) {
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error && !card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Aucune carte trouvée</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12">
          Gérer mon profil
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire d'édition */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Éditer mes informations
            </h2>
            <ProfileFormEditor
              cardId={card.id}
              initialData={{
                fullName: card.fullName,
                jobTitle: card.jobTitle,
                company: card.company,
                phone: card.phone,
                email: card.email,
                bio: card.bio,
                location: card.location,
                website: card.website,
                theme: card.theme,
              }}
              onSubmit={handleSaveProfile}
              isLoading={isSaving}
            />
          </div>

          {/* Aperçu en direct */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Aperçu en direct
            </h2>
            <ProfileCardDisplay card={card} />

            {/* Lien public */}
            <div className="mt-6 bg-white rounded-lg shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Votre URL publique:</p>
              <a
                href={`/p/${card.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold break-all"
              >
                {typeof window !== 'undefined' && 
                  `${window.location.origin}/p/${card.slug}`}
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/p/${card.slug}`
                  );
                  alert('Lien copié!');
                }}
                className="mt-3 block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                📋 Copier le lien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
