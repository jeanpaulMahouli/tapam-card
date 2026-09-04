"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  location?: string | null;
  website?: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<Profile | null>(null);

  // Charger le profil
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Erreur lors du chargement du profil");
        }
        const { data } = await res.json();
        setProfile(data);
        setFormData(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error: errMsg, details } = await res.json();
        if (details) {
          setError(`${errMsg}: ${details.map((d: any) => d.message).join(", ")}`);
        } else {
          setError(errMsg || "Erreur lors de la mise à jour");
        }
        return;
      }

      const { data } = await res.json();
      setProfile(data);
      setSuccess("Profil mis à jour avec succès ✓");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal flex items-center justify-center p-4">
        <div className="text-goldLight">Chargement du profil...</div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal flex items-center justify-center p-4">
        <div className="text-red-500">Impossible de charger le profil</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-charcoal p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-goldLight bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <Link
            href="/dashboard"
            className="text-goldLight hover:text-gold transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Messages d'erreur/succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200 text-sm">
            {success}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-charcoal/50 border border-gold/20 rounded-lg p-6 space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-goldLight mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-goldLight mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                placeholder="+237 6 98 95 57 41"
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* Titre professionnel et Entreprise */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-goldLight mb-2">
                  Titre professionnel
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle || ""}
                  onChange={handleChange}
                  placeholder="ex: Développeur Full-Stack"
                  className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-goldLight mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company || ""}
                  onChange={handleChange}
                  placeholder="ex: TechCorp"
                  className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Localisation
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="ex: Douala, Cameroun"
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* Site web */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Site web
              </label>
              <input
                type="url"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* URL Avatar */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                URL de l'avatar
              </label>
              <input
                type="url"
                name="avatarUrl"
                value={formData.avatarUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            {/* Biographie */}
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Biographie
              </label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Parlez un peu de vous..."
                rows={4}
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gold to-goldLight text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Mise à jour..." : "Mettre à jour"}
            </button>
            <Link
              href="/dashboard/profile/links"
              className="flex-1 px-6 py-3 bg-charcoal border border-gold/30 text-goldLight font-semibold rounded-lg hover:border-gold hover:bg-charcoal/80 transition-colors text-center"
            >
              Gérer les liens →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
