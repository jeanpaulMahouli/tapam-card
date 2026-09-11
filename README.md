# TAPAM CARD

MVP web mobile-first de carte de visite NFC et QR Code configurable par son propriétaire.

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Prisma et MariaDB.

## Installation

1. Copiez `.env.example` en `.env` et renseignez une base MariaDB vide.
2. Installez les paquets : `pnpm install`.
3. Initialisez la base : `pnpm prisma migrate dev --name init`.
4. Ajoutez les données de démonstration : `pnpm prisma db seed`.
5. Lancez le projet : `pnpm dev`.

Administration locale : `admin` / `Admin123!ChangeMe` (à changer immédiatement hors développement). Démonstration : `TPM-000001` / `Demo123!ChangeMe`.

## Variables

- `DATABASE_URL` : connexion MariaDB, par exemple `mysql://user:password@localhost:3306/tapam_card`.
- `APP_URL` : domaine public sans slash final.
- `WHATSAPP_NUMBER` : numéro commercial, sans le signe `+`.
- `AUTH_SECRET` : chaîne aléatoire longue utilisée pour signer les sessions.

## Déploiement VPS

Installez Node.js LTS, MariaDB et pnpm. Ajoutez les variables d’environnement de production, exécutez `pnpm prisma migrate deploy`, puis `pnpm build` et `pnpm start`. Placez l’application derrière Nginx avec HTTPS. Les images sont prévues dans `public/uploads`; remplacez plus tard ce stockage local par un stockage objet si nécessaire.

## Fonctionnalités MVP

- Landing et commandes WhatsApp configurables.
- Création de carte par l’admin avec numéro, URL, identifiant et mot de passe temporaire.
- QR code URL-only, téléchargement et URL NFC identique.
- Authentification par cookies HTTP-only et mots de passe hashés.
- Changement obligatoire du mot de passe initial, espace client, édition du profil et thèmes Gold/Silver/Black.
- Profil public, carte inactive/non configurée, VCF contact et compteur de consultations.

## Ressources visuelles

Déposez le logo et les images produit dans `public/images/`. Les emplacements sont déjà prévus dans l’interface.

## À brancher avant production

La réinitialisation email/SMS, l’upload d’image serveur sécurisé, la notice PDF et l’association à un utilisateur existant sont volontairement laissés comme extensions structurées, afin de préserver le flux critique du MVP.
