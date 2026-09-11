'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomButtonsManager } from '@/components/CustomButtonsManager';

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  subtitle: string;
  bio: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  snapchat: string;
  youtube: string;
  whatsapp: string;
  profileImage: string;
  cardSlug: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  if (!profile) {
    return <div className="p-8">Profil non trouvé</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Gérer mon profil</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="socials">Réseaux</TabsTrigger>
          <TabsTrigger value="buttons">Boutons</TabsTrigger>
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="info" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Les modifications sont automatiquement sauvegardées.
            </p>
            {/* Ici vous pouvez ajouter les formulaires pour éditer les infos de base */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">Prénom</label>
                <p className="text-slate-700 dark:text-slate-300">{profile.firstName}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Nom</label>
                <p className="text-slate-700 dark:text-slate-300">{profile.lastName}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Titre</label>
                <p className="text-slate-700 dark:text-slate-300">{profile.title}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Sous-titre</label>
                <p className="text-slate-700 dark:text-slate-300">{profile.subtitle}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Réseaux sociaux */}
        <TabsContent value="socials" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Réseaux sociaux</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Liez vos comptes de réseaux sociaux pour les afficher sur votre carte.
            </p>
            {/* Ici vous pouvez ajouter les formulaires pour éditer les réseaux sociaux */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-2">LinkedIn</label>
                <p className="text-slate-700 dark:text-slate-300 truncate">{profile.linkedin || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Instagram</label>
                <p className="text-slate-700 dark:text-slate-300 truncate">{profile.instagram || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Facebook</label>
                <p className="text-slate-700 dark:text-slate-300 truncate">{profile.facebook || 'Non renseigné'}</p>
              </div>
              <div>
                <label className="block font-medium mb-2">Twitter/X</label>
                <p className="text-slate-700 dark:text-slate-300 truncate">{profile.twitter || 'Non renseigné'}</p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Boutons personnalisés */}
        <TabsContent value="buttons" className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Boutons personnalisés</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Ajoutez vos propres boutons d'action sur votre carte digitale. Vous pouvez rediriger vers votre site web,
              un formulaire de contact, un calendrier de rendez-vous, etc.
            </p>
            <CustomButtonsManager profileId={profile.id} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
