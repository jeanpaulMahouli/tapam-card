"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur de connexion");
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Erreur réseau, veuillez réessayer");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm bg-charcoal rounded-2xl shadow-xl p-8 border border-gold/20">
        <h1 className="text-2xl font-bold text-gold mb-1 text-center">
          TAPAM CARD
        </h1>
        <p className="text-silver text-sm text-center mb-6">
          Connectez-vous à votre espace
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-silverLight mb-1">
              Identifiant (username ou code carte)
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="w-full rounded-lg bg-black border border-gold/30 px-3 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="TPM-000001"
            />
          </div>

          <div>
            <label className="block text-sm text-silverLight mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg bg-black border border-gold/30 px-3 py-2 text-white focus:outline-none focus:border-gold"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-black font-semibold rounded-lg py-2 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}
