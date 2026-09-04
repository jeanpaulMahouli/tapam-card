import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session!.userId },
    include: { profile: true, cards: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gold mb-2">
          Bienvenue {user!.username}
        </h1>
        <p className="text-silver mb-8">
          Voici un aperçu de votre identité professionnelle digitale.
        </p>

        <section className="bg-charcoal rounded-2xl border border-gold/20 p-6 mb-6">
          <h2 className="text-gold font-semibold mb-2">Profil</h2>
          {user!.profile ? (
            <div className="text-silverLight text-sm space-y-1">
              <p>{user!.profile.fullName}</p>
              <p>{user!.profile.jobTitle}</p>
              <p>{user!.profile.company}</p>
            </div>
          ) : (
            <p className="text-silverLight text-sm">
              Aucun profil configuré pour le moment.
            </p>
          )}
        </section>

        <section className="bg-charcoal rounded-2xl border border-gold/20 p-6">
          <h2 className="text-gold font-semibold mb-2">
            Mes cartes ({user!.cards.length})
          </h2>
          <ul className="text-silverLight text-sm space-y-2">
            {user!.cards.map((card) => (
              <li key={card.id} className="flex justify-between">
                <span>{card.code}</span>
                <span className="text-gold">{card.status}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
