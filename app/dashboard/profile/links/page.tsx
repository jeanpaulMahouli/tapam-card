"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Service {
  id: string;
  type: string;
  label: string;
  value: string;
  displayOrder: number;
  isVisible: boolean;
}

const SERVICE_TYPES = [
  { value: "PHONE", label: "📱 Téléphone" },
  { value: "EMAIL", label: "📧 Email" },
  { value: "WEBSITE", label: "🌐 Site web" },
  { value: "LINKEDIN", label: "💼 LinkedIn" },
  { value: "TWITTER", label: "𝕏 Twitter" },
  { value: "INSTAGRAM", label: "📷 Instagram" },
  { value: "FACEBOOK", label: "👥 Facebook" },
  { value: "GITHUB", label: "💻 GitHub" },
  { value: "WHATSAPP", label: "💬 WhatsApp" },
  { value: "CUSTOM", label: "🔗 Personnalisé" },
];

export default function LinksPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: "PHONE",
    label: "",
    value: "",
    displayOrder: 0,
    isVisible: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Charger les services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/profile/services");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Erreur lors du chargement des services");
        }
        const { data } = await res.json();
        setServices(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [router]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/profile/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error: errMsg } = await res.json();
        setError(errMsg || "Erreur lors de l'ajout du service");
        return;
      }

      const { data } = await res.json();
      setServices([...services, data]);
      setFormData({
        type: "PHONE",
        label: "",
        value: "",
        displayOrder: 0,
        isVisible: true,
      });
      setShowForm(false);
      setSuccess("Service ajouté avec succès ✓");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) return;

    try {
      const res = await fetch(`/api/profile/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setServices(services.filter((s) => s.id !== id));
      setSuccess("Service supprimé avec succès ✓");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-charcoal flex items-center justify-center p-4">
        <div className="text-goldLight">Chargement des services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-charcoal p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gold to-goldLight bg-clip-text text-transparent">
            Mes Services & Liens
          </h1>
          <Link
            href="/dashboard/profile"
            className="text-goldLight hover:text-gold transition-colors"
          >
            ← Retour
          </Link>
        </div>

        {/* Messages */}
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

        {/* Bouton Ajouter */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full px-6 py-3 bg-gradient-to-r from-gold to-goldLight text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all"
          >
            + Ajouter un service
          </button>
        )}

        {/* Formulaire d'ajout */}
        {showForm && (
          <form onSubmit={handleAddService} className="mb-8 bg-charcoal/50 border border-gold/20 rounded-lg p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Type de service
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white focus:border-gold focus:outline-none transition-colors"
              >
                {SERVICE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Libellé
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="ex: Mobile principal"
                required
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-goldLight mb-2">
                Valeur
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="ex: +237 6 98 95 57 41"
                required
                className="w-full px-4 py-2 bg-black/50 border border-gold/30 rounded-lg text-white placeholder-silver/50 focus:border-gold focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="w-4 h-4 rounded accent-gold"
                />
                <span className="text-sm font-medium text-goldLight">Visible sur le profil public</span>
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-gold to-goldLight text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-gold/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Ajout..." : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-2 bg-charcoal border border-gold/30 text-goldLight font-semibold rounded-lg hover:border-gold transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {/* Liste des services */}
        <div className="space-y-3">
          {services.length === 0 ? (
            <div className="text-center p-8 bg-charcoal/30 border border-gold/10 rounded-lg">
              <p className="text-silver">Aucun service ajouté pour le moment</p>
              <p className="text-silver/70 text-sm mt-1">Cliquez sur "Ajouter un service" pour commencer</p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 bg-charcoal/50 border border-gold/20 rounded-lg hover:border-gold/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-semibold text-goldLight">{service.label}</div>
                  <div className="text-sm text-silver">{service.type}</div>
                  <div className="text-xs text-silver/70 mt-1">{service.value}</div>
                  {!service.isVisible && (
                    <div className="text-xs text-orange-400 mt-1">🔒 Caché</div>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteService(service.id)}
                  className="ml-4 px-4 py-2 text-sm bg-red-900/30 text-red-300 border border-red-500/30 rounded hover:bg-red-900/50 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
