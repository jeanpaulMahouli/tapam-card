import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Fonction corrigée pour générer un numéro de carte valide
function generateCardNumber(): string {
  // Génère une chaîne aléatoire de 8 caractères alphanumériques
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "TPM";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log("🌱 Démarrage du seed...");

  try {
    // Création du compte administrateur
    const hash = await bcrypt.hash("Admin123!ChangeMe", 12);

    const admin = await prisma.user.upsert({
      where: {
        email: "admin@exemple.cm",
      },
      update: {},
      create: {
        email: "admin@exemple.cm",
        username: "admin",
        passwordHash: hash,
        role: "ADMIN",
        mustChangePassword: false,
      },
    });

    console.log("✅ Admin créé:", admin.username);

    // Création du compte utilisateur de démonstration
    const demoHash = await bcrypt.hash("kjkfbg1c", 12);
    const demoUser = await prisma.user.upsert({
      where: {
        email: "jean@exemple.cm",
      },
      update: {},
      create: {
        email: "jean@exemple.cm",
        username: "jean_demo",
        passwordHash: demoHash,
        role: "USER",
        mustChangePassword: false,
      },
    });

    console.log("✅ Utilisateur démo créé:", demoUser.username);
    console.log("   Email:", demoUser.email);
    console.log("   Mot de passe:", "kjkfbg1c");

    // Création de la carte EXPRESS pour l'utilisateur démo
    const cardNumber = generateCardNumber();
    const demoCard = await prisma.card.upsert({
      where: {
        cardNumber: cardNumber,
      },
      update: {},
      create: {
        cardNumber: cardNumber,
        cardType: "EXPRESS",
        userId: demoUser.id,
        isPublished: true,
        firstName: "Jean",
        lastName: "Démo",
        title: "Développeur Web",
        subtitle: "Passionate About Code",
        bio: "Ceci est un profil de démonstration pour tester l'application Tapam Card.",
      },
    });

    console.log("✅ Carte EXPRESS créée:", demoCard.cardNumber);
    console.log("   Type:", demoCard.cardType);

    console.log("\n✨ Seed complété avec succès!");
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
