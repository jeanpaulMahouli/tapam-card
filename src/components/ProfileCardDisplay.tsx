'use client';

import React from 'react';
import Image from 'next/image';
import { CardDisplayData, getThemeClasses } from '@/lib/card-utils';

interface ProfileCardDisplayProps {
  card: CardDisplayData;
  isEditable?: boolean;
  onEdit?: () => void;
}

/**
 * Composant d'affichage unifié des cartes de profil
 * Fonctionne pour l'affichage public et le dashboard
 */
export function ProfileCardDisplay({
  card,
  isEditable = false,
  onEdit,
}: ProfileCardDisplayProps) {
  const theme = getThemeClasses(card.theme);

  if (!card || !card.isConfigured) {
    return (
      <div className={`${theme.background} rounded-lg p-6 text-center`}>
        <p className={theme.text}>
          Cette carte n'est pas encore configurée
        </p>
      </div>
    );
  }

  return (
    <div className={`${theme.background} rounded-lg shadow-lg overflow-hidden`}>
      {/* En-tête */}
      <div className={`${theme.accent} px-6 py-8 text-center text-white`}>
        {card.profileImage && (
          <div className="mb-4 flex justify-center">
            <Image
              src={card.profileImage}
              alt={card.fullName}
              width={120}
              height={120}
              className="rounded-full border-4 border-white"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{card.fullName}</h1>
        <p className="text-lg mt-2">{card.jobTitle}</p>
        <p className="text-sm opacity-90">{card.company}</p>
      </div>

      {/* Contenu principal */}
      <div className="px-6 py-6">
        {/* Bio */}
        {card.bio && (
          <p className={`${theme.text} mb-6 text-center italic`}>
            "{card.bio}"
          </p>
        )}

        {/* Informations de contact */}
        <div className={`${theme.text} space-y-3 mb-6`}>
          {card.email && (
            <div className="flex items-center">
              <span className="font-semibold mr-2">📧</span>
              <a
                href={`mailto:${card.email}`}
                className={`${theme.accent} text-white px-3 py-1 rounded hover:opacity-90`}
              >
                {card.email}
              </a>
            </div>
          )}

          {card.phone && (
            <div className="flex items-center">
              <span className="font-semibold mr-2">📱</span>
              <a
                href={`tel:${card.phone}`}
                className={`${theme.accent} text-white px-3 py-1 rounded hover:opacity-90`}
              >
                {card.phone}
              </a>
            </div>
          )}

          {card.location && (
            <div className="flex items-center">
              <span className="font-semibold mr-2">📍</span>
              <span>{card.location}</span>
            </div>
          )}

          {card.website && (
            <div className="flex items-center">
              <span className="font-semibold mr-2">🌐</span>
              <a
                href={card.website}
                target="_blank"
                rel="noopener noreferrer"
                className={`${theme.accent} text-white px-3 py-1 rounded hover:opacity-90`}
              >
                Voir le site
              </a>
            </div>
          )}
        </div>

        {/* Boutons personnalisés */}
        {card.customButtons && card.customButtons.length > 0 && (
          <div className="border-t pt-6 mt-6">
            <div className="grid grid-cols-2 gap-3">
              {card.customButtons.map((button) => (
                <a
                  key={button.id}
                  href={button.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${theme.button} text-white px-4 py-2 rounded text-center font-semibold transition-colors`}
                >
                  {button.icon && <span className="mr-1">{button.icon}</span>}
                  {button.label}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className={`${theme.text} text-center text-sm mt-6 pt-6 border-t`}>
          <span className="opacity-75">Vues: {card.views}</span>
        </div>

        {/* Bouton d'édition */}
        {isEditable && onEdit && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={onEdit}
              className={`${theme.button} text-white px-6 py-2 rounded font-semibold transition-colors`}
            >
              ✏️ Éditer le profil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
