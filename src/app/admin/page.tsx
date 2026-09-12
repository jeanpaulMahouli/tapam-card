import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function Admin() {
  await requireAdmin();

  const [cards, users, active, suspended, incompleteProfiles] = await Promise.all([
    prisma.card.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.card.count({ where: { status: "ACTIVE" } }),
    prisma.card.count({ where: { status: "SUSPENDED" } }),
    // "Non configurées" = profils sans titre ET sans prénom renseignés
    // (isPublished n'existe pas dans le schéma Profile actuel)
    prisma.profile.count({
      where: {
        AND: [
          { OR: [{ title: null }, { title: "" }] },
          { OR: [{ firstName: null }, { firstName: "" }] },
        ],
      },
    }),
  ]);

  const stats: [string, number][] = [
    ["Cartes", cards],
    ["Utilisateurs", users],
    ["Actives", active],
    ["Suspendues", suspended],
    ["Non configurées", incompleteProfiles],
  ];

  return (
    <main className="shell py-8">
      <p className="font-black tracking-widest text-gold">ADMINISTRATION</p>
      <h1 className="mt-2 text-3xl font-black">TAPAM CARD</h1>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(([n, v]) => (
          <div className="card p-5" key={n}>
            <p className="muted text-sm">{n}</p>
            <p className="mt-2 text-3xl font-black">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-7 flex gap-3">
        <Link href="/admin/cards/new" className="btn btn-primary">
          Créer une carte
        </Link>
        <Link href="/admin/cards" className="btn btn-soft">
          Gérer les cartes
        </Link>
      </div>
    </main>
  );
}
