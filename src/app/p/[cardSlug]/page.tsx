'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Share2, Heart } from 'lucide-react';
import { ProfileCard } from '@/components/ProfileCard';
import { SocialLinks } from '@/components/SocialLinks';
import prisma from '@/lib/prisma';

interface Profile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  profileImage: string;
  cardSlug: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  snapchat: string;
  youtube: string;
  whatsapp: string;
  customButtons: Array<{
    id: string;
    label: string;
    url: string;
    order: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export default function CardPage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const cardSlug = params.cardSlug as string;
        const response = await fetch(`/api/cards/${cardSlug}`);
        
        if (!response.ok) {
          throw new Error('Profile not found');
        }

        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.cardSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-2">Card not found</h1>
          <p className="text-slate-400">{error || 'The profile you are looking for does not exist'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-md mx-auto p-4 pt-8">
        {/* Header avec logo TAPAM CARD */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-white tracking-wide">TAPAM</span>
            <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
          </div>
          <p className="text-slate-300 text-sm italic">CARD</p>
        </div>

        {/* Card principale */}
        <ProfileCard profile={profile} />

        {/* Boutons personnalisés */}
        {profile.customButtons && profile.customButtons.length > 0 && (
          <div className="mt-6 space-y-3">
            {profile.customButtons
              .sort((a, b) => a.order - b.order)
              .map((button) => (
                <a
                  key={button.id}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-lg transition text-center"
                >
                  {button.label}
                </a>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-xs">
          <p>© 2024 TAPAM Card. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
