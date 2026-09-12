import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Fonction pour générer un numéro de carte aléatoire
function generateCardNumber(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

async function main() {
  console.log('🌱 Démarrage du seed...');

  try {
    // Créer ou mettre à jour l'utilisateur admin
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@tapam-card.com' },
      update: {},
      create: {
        email: 'admin@tapam-card.com',
        name: 'Admin',
        password: await bcrypt.hash('admin123', 10),
        emailVerified: new Date(),
      },
    });

    console.log('✅ Admin créé:', adminUser.name);

    // Créer ou mettre à jour l'utilisateur démo
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@tapam-card.com' },
      update: {},
      create: {
        email: 'demo@tapam-card.com',
        name: 'Demo User',
        password: await bcrypt.hash('demo123', 10),
        emailVerified: new Date(),
      },
    });

    console.log('✅ Utilisateur démo créé:', demoUser.name);

    // Créer le profil pour l'admin
    const adminProfile = await prisma.profile.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        firstName: 'Jean',
        lastName: 'Admin',
        title: 'Administrateur',
        subtitle: 'Gestion de Tapam Card',
        bio: 'Bienvenue sur ma carte numérique professionnelle !',
        email: 'admin@tapam-card.com',
        phone: '+33612345678',
        location: 'Paris, France',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        coverUrl: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
      },
    });

    console.log('✅ Profil admin créé:', adminProfile.firstName, adminProfile.lastName);

    // Créer le profil pour l'utilisateur démo
    const demoProfile = await prisma.profile.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        firstName: 'Marie',
        lastName: 'Developer',
        title: 'Développeuse Web',
        subtitle: 'Spécialiste React & Node.js',
        bio: 'Passionnée par le développement web et les nouvelles technologies. Créative et toujours à la recherche de nouvelles solutions !',
        email: 'marie@example.com',
        phone: '+33698765432',
        location: 'Lyon, France',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marie',
        coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
      },
    });

    console.log('✅ Profil démo créé:', demoProfile.firstName, demoProfile.lastName);

    // Créer des cartes
    const cards = [];

    // Carte 1 - Admin EXPRESS
    const card1 = await prisma.card.create({
      data: {
        userId: adminUser.id,
        cardNumber: generateCardNumber(),
        cardType: 'EXPRESS',
        title: 'Admin Card',
        isPublic: true,
      },
    });
    cards.push(card1);
    console.log('✅ Carte 1 créée (EXPRESS):', card1.cardNumber);

    // Carte 2 - Demo BUSINESS
    const card2 = await prisma.card.create({
      data: {
        userId: demoUser.id,
        cardNumber: generateCardNumber(),
        cardType: 'BUSINESS',
        title: 'Professional Card',
        isPublic: true,
      },
    });
    cards.push(card2);
    console.log('✅ Carte 2 créée (BUSINESS):', card2.cardNumber);

    // Carte 3 - Demo CUSTOM
    const card3 = await prisma.card.create({
      data: {
        userId: demoUser.id,
        cardNumber: generateCardNumber(),
        cardType: 'CUSTOM',
        title: 'Creative Card',
        isPublic: false,
      },
    });
    cards.push(card3);
    console.log('✅ Carte 3 créée (CUSTOM):', card3.cardNumber);

    // Créer des liens sociaux pour le profil démo
    const socialLinks = await prisma.socialLink.createMany({
      data: [
        {
          profileId: demoProfile.id,
          platform: 'linkedin',
          url: 'https://linkedin.com/in/mariedeveloper',
        },
        {
          profileId: demoProfile.id,
          platform: 'github',
          url: 'https://github.com/mariedeveloper',
        },
        {
          profileId: demoProfile.id,
          platform: 'twitter',
          url: 'https://twitter.com/mariedeveloper',
        },
      ],
    });

    console.log('✅ Liens sociaux créés:', socialLinks.count);

    // Résumé
    console.log('\n📊 === RÉSUMÉ DU SEED ===');
    console.log(`👥 Utilisateurs créés: 2`);
    console.log(`👤 Profils créés: 2`);
    console.log(`💳 Cartes créées: ${cards.length}`);
    console.log(`🔗 Liens sociaux créés: ${socialLinks.count}`);
    console.log('\n🎉 Seed complété avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
