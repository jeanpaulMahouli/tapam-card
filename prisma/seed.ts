import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fonction pour générer un ID de carte aléatoire (ex: TPMXFS45F)
function generateRandomCardId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let cardId = "TPM";
  for (let i = 0; i < 9; i++) {
    cardId += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return cardId;
}

// Fonction pour générer un mot de passe temporaire
function createTemporaryPassword(length = 10): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  return Array.from({ length }, () => 
    alphabet[Math.floor(Math.random() * alphabet.length)]
  ).join("");
}

async function main() {
  console.log("🌱 Démarrage du seed...");

  // ============================================
  // 1. Création du compte administrateur
  // ============================================
  const adminHash = await bcrypt.hash("Admin123!ChangeMe", 12);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: adminHash,
      email: "admin@tapam.cm",
      role: "ADMIN",
      status: "ACTIVE",
      mustChangePassword: true,
      profile: {
        create: {
          firstName: "Admin",
          lastName: "TAPAM",
          title: "Administrateur",
          subtitle: "Gestionnaire de plateforme",
          bio: "Compte administrateur principal de TAPAM Card",
        },
      },
    },
  });
  console.log("✅ Admin créé:", admin.username);

  // ============================================
  // 2. Création d'une carte ADMIN
  // ============================================
  const adminCardId = generateRandomCardId();
  const adminCard = await prisma.card.upsert({
    where: { cardNumber: adminCardId },
    update: {},
    create: {
      cardNumber: adminCardId,
      slug: adminCardId.toLowerCase(),
      type: "BUSINESS",
      status: "ACTIVE",
      userId: admin.id,
      activatedAt: new Date(),
    },
  });
  console.log("✅ Carte ADMIN créée:", adminCard.cardNumber);

  // ============================================
  // 3. Création du compte utilisateur de démonstration
  // ============================================
  const demoCardId = generateRandomCardId();
  const demoPassword = createTemporaryPassword();
  const demoHash = await bcrypt.hash(demoPassword, 12);
  const demoUser = await prisma.user.upsert({
    where: { username: demoCardId },
    update: {},
    create: {
      username: demoCardId,
      passwordHash: demoHash,
      email: "jean@exemple.cm",
      role: "USER",
      status: "ACTIVE",
      profile: {
        create: {
          firstName: "Jean",
          lastName: "Mahouli",
          title: "Webmaster & Développeur",
          subtitle: "Expert en développement web",
          bio: "Créateur de TAPAM Card - Plateforme de cartes de visite numériques",
          profileImage: "https://via.placeholder.com/200",
        },
      },
    },
  });
  console.log("✅ Utilisateur démo créé:", demoUser.username);
  console.log("   Email:", demoUser.email);
  console.log("   Mot de passe temporaire:", demoPassword);

  // ============================================
  // 4. Création de la carte EXPRESS de démonstration
  // ============================================
  const expressCardId = generateRandomCardId();
  const expressCard = await prisma.card.upsert({
    where: { cardNumber: expressCardId },
    update: {},
    create: {
      cardNumber: expressCardId,
      slug: expressCardId.toLowerCase(),
      type: "EXPRESS",
      status: "ACTIVE",
      userId: demoUser.id,
      activatedAt: new Date(),
    },
  });
  console.log("✅ Carte EXPRESS créée:", expressCard.cardNumber);

  // ============================================
  // 5. Création d'une carte BUSINESS de démonstration
  // ============================================
  const businessCardId = generateRandomCardId();
  const businessCard = await prisma.card.upsert({
    where: { cardNumber: businessCardId },
    update: {},
    create: {
      cardNumber: businessCardId,
      slug: businessCardId.toLowerCase(),
      type: "BUSINESS",
      status: "ACTIVE",
      userId: demoUser.id,
      activatedAt: new Date(),
    },
  });
  console.log("✅ Carte BUSINESS créée:", businessCard.cardNumber);

  // ============================================
  // 6. Création d'une carte CUSTOM de démonstration
  // ============================================
  const customCardId = generateRandomCardId();
  const customCard = await prisma.card.upsert({
    where: { cardNumber: customCardId },
    update: {},
    create: {
      cardNumber: customCardId,
      slug: customCardId.toLowerCase(),
      type: "CUSTOM",
      status: "ACTIVE",
      userId: demoUser.id,
      activatedAt: new Date(),
    },
  });
  console.log("✅ Carte CUSTOM créée:", customCard.cardNumber);

  console.log("\n🎉 Seed complété avec succès!");
  console.log("\n📋 Comptes créés:");
  console.log("   Admin - username: admin");
  console.log(`   Démo - username: ${demoCardId}`);
  console.log(`\n🔐 Identifiants de démonstration:`);
  console.log(`   Email: jean@exemple.cm`);
  console.log(`   Mot de passe: ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error("❌ Erreur lors du seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
