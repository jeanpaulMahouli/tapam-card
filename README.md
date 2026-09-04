# TAPAM CARD

**Votre carte de visite. Votre identité. Votre contrôle.**

TAPAM CARD est une plateforme d'identité professionnelle digitale associée à des supports physiques NFC et QR Code. Un support physique reste identique, tandis que le profil digital qu'il pointe peut évoluer à tout moment.

> ⚠️ Projet en cours de construction, phase par phase (voir section Roadmap). Ne pas considérer comme terminé tant que le parcours complet Admin → Carte → Client → Profil public n'est pas fonctionnel de bout en bout.

## Stack technique

- **Framework** : Next.js 14 (App Router) + React 18 + TypeScript
- **Base de données** : MariaDB
- **ORM** : Prisma
- **Styling** : Tailwind CSS (thème Gold / Noir / Silver inspiré du logo TAPAM)
- **Auth** : sessions sécurisées, mots de passe hashés (bcrypt), cookies HTTP-only
- **QR Code** : génération dynamique via la librairie `qrcode`

## Architecture du code

```text
src/
  app/            # Pages Next.js (App Router)
  components/     # Composants UI réutilisables
  services/       # Logique métier (cartes, profils, auth, whatsapp, qrcode...)
  lib/            # Helpers techniques (prisma client, session, etc.)
  database/       # Accès aux données / requêtes centralisées
  auth/           # Logique d'authentification et de session
  api/            # Handlers d'API réutilisables
  types/          # Types TypeScript partagés
  utils/          # Fonctions utilitaires génériques
prisma/
  schema.prisma   # Modèle de données
  seed.ts         # Données de test
```

## Installation locale

### Prérequis

- Node.js >= 18
- MariaDB >= 10.6 installé et démarré

### Étapes

1. **Cloner le dépôt et installer les dépendances**

   ```bash
   git clone https://github.com/jeanpaulMahouli/tapam-card.git
   cd tapam-card
   npm install
   ```

2. **Configurer les variables d'environnement**

   ```bash
   cp .env.example .env
   ```

   Puis éditer `.env` :
   - `DATABASE_URL` : connexion vers votre instance MariaDB
   - `APP_URL` : domaine de l'application (localhost en dev)
   - `WHATSAPP_NUMBER` : numéro WhatsApp commercial réel (format international sans `+`)
   - `AUTH_SECRET` : générer une valeur aléatoire forte (`openssl rand -base64 32`)

3. **Créer la base de données MariaDB**

   ```sql
   CREATE DATABASE tapam_card CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'tapam_user'@'localhost' IDENTIFIED BY 'tapam_password';
   GRANT ALL PRIVILEGES ON tapam_card.* TO 'tapam_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

4. **Exécuter les migrations Prisma**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Injecter les données de test**

   ```bash
   npm run seed
   ```

6. **Lancer le serveur de développement**

   ```bash
   npm run dev
   ```

   L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Comptes de test (après seed)

| Rôle  | Identifiant   | Mot de passe   |
|-------|---------------|----------------|
| Admin | `admin`       | `Admin123!`    |
| Client| `TPM-000001`  | `Client123!`   |

> Ces comptes sont uniquement destinés au développement local. Ne jamais les utiliser en production.

## Roadmap de développement (par phases)

- [x] Phase 1 — Initialisation (Next.js, TypeScript, Tailwind, MariaDB, Prisma, structure)
- [ ] Phase 2 — Modèles de base de données (User, Card, Profile, Service, Design, CardView)
- [ ] Phase 3 — Authentification
- [ ] Phase 4 — Création automatique des cartes par l'Admin
- [ ] Phase 5 — Page publique `/p/[slug]`
- [ ] Phase 6 — Dashboard client
- [ ] Phase 7 — Éditeur de profil
- [ ] Phase 8 — Designs
- [ ] Phase 9 — QR Code
- [ ] Phase 10 — Dashboard Admin
- [ ] Phase 11 — WhatsApp
- [ ] Phase 12 — Sécurité + tests
- [ ] Phase 13 — SEO + responsive + finition UI
- [ ] Phase 14 — Déploiement

## Fonctionnalités exclues du MVP (volontairement)

Paiement en ligne, abonnements, marketplace, réseau social, messagerie, applications natives, CRM, IA, analytics avancés. Voir la roadmap V2/V3/V4 pour les évolutions futures (TAPAM Business, TAPAM Network, etc.).

## Licence

Projet privé — Tous droits réservés © TAPAM CARD.
