"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Card, Profile } from "@/generated/prisma";
import { SocialLinks } from "@/components/SocialLinks";

interface CardPageProps {
  params: {
    cardSlug: string;
  };
}

interface CardData {
  card: Card & { user: { profile: Profile } };
}

export default function CardPage({ params }: CardPageProps) {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await fetch(`/api/cards/${params.cardSlug}`);
        if (!response.ok) {
          throw new Error("Carte non trouvée");
        }
        const cardData = await response.json();
        setData(cardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, [params.cardSlug]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (error || !data) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error || "Erreur"}</div>;
  }

  const { card, user } = data.card;
  const profile = user.profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Photo de profil */}
          {profile?.photo && (
            <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700">
              <Image
                src={profile.photo}
                alt={`${profile.firstName} ${profile.lastName}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Contenu */}
          <div className="p-8">
            {/* Nom et titre */}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {profile?.firstName} {profile?.lastName}
            </h1>
            {profile?.jobTitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{profile.jobTitle}</p>
            )}
            {profile?.company && (
              <p className="text-md text-gray-500 dark:text-gray-400">{profile.company}</p>
            )}

            {/* Bio */}
            {profile?.bio && (
              <p className="text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">{profile.bio}</p>
            )}

            {/* Réseaux sociaux */}
            <div className="mt-8">
              <SocialLinks
                linkedin={profile?.linkedin || null}
                facebook={profile?.facebook || null}
                instagram={profile?.instagram || null}
                tiktok={profile?.tiktok || null}
                xUrl={profile?.xUrl || null}
                email={profile?.email || null}
                phone={profile?.phone || null}
                whatsapp={profile?.whatsapp || null}
                website={profile?.website || null}
              />
            </div>

            {/* Services */}
            {profile?.showServices && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Services</h2>
                <div className="space-y-4">
                  {profile.services && profile.services.length > 0 ? (
                    profile.services.map((service) => (
                      <div key={service.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                        {service.description && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                            {service.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Aucun service disponible</p>
                  )}
                </div>
              </div>
            )}

            {/* Galerie */}
            {profile?.gallery && profile.gallery.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Galerie</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {profile.gallery.map((item) => (
                    <div key={item.id} className="relative w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.caption || "Galerie"}
                        fill
                        className="object-cover"
                      />
                      {item.caption && (
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-70 transition-all flex items-end p-3">
                          <p className="text-white text-sm">{item.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info carte */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Carte: {card.cardNumber}</p>
              <p>Créée le {new Date(card.createdAt).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
