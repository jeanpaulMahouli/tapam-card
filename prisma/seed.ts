import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Fonction pour générer un ID aléatoire
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Fonction pour générer un numéro de carte aléatoire (ex: TPMPH9WY9B7B)
function generateCardNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TPM';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function main() {
  console.log('🌱 Démarrage du seed...');

  try {
    // ============================================
    // 1. Création de l'admin
    // ============================================
    const admin = await prisma.user.upsert({
      where: { email: 'admin@exemple.cm' },
      update: {},
      create: {
        email: 'admin@exemple.cm',
        name: 'admin',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin créé: admin@exemple.cm');

    // Créer un profil pour l'admin
    await prisma.profile.upsert({
      where: { userId: admin.id },
      update: {},
      create: {
        userId: admin.id,
        firstName: 'Administrateur',
        lastName: 'TAPAM',
        title: 'Admin System',
        subtitle: 'Gestion des cartes digitales',
        bio: 'Profil administrateur du système TAPAM Card',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        coverImage: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop',
      },
    });

    // Créer une carte pour l'admin
    const adminCardNumber = 'TPMADMIN001';
    await prisma.card.upsert({
      where: { cardNumber: adminCardNumber },
      update: {},
      create: {
        cardNumber: adminCardNumber,
        slug: adminCardNumber.toLowerCase(),
        type: 'BUSINESS',
        status: 'ACTIVE',
        designTemplate: 'SIGNATURE',
        userId: admin.id,
        activatedAt: new Date(),
      },
    });
    console.log(`✅ Carte ADMIN créée: ${adminCardNumber}`);

    // ============================================
    // 2. Création de l'utilisateur de démonstration
    // ============================================
    const tempPassword = 'Demo12345!';
    const demoUser = await prisma.user.upsert({
      where: { email: 'jean@exemple.cm' },
      update: {},
      create: {
        email: 'jean@exemple.cm',
        name: 'Jean Paul',
        password: await bcrypt.hash(tempPassword, 10),
        role: 'USER',
      },
    });
    console.log('✅ Utilisateur démo créé: jean@exemple.cm');

    // Créer un profil pour l'utilisateur démo
    await prisma.profile.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        firstName: 'Jean',
        lastName: 'Paul Mahouli',
        title: 'Développeur Full Stack',
        subtitle: 'Créateur de TAPAM Card',
        bio: 'Passionné par la création de solutions digitales innovantes. Spécialisé en web et mobile development.',
        profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jean',
        coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',
        phone: '+237 123 456 789',
        email: 'jean@exemple.cm',
      },
    });

    // ============================================
    // 3. Création des cartes de démonstration
    // ============================================

    // Carte EXPRESS
    const expressCardNumber = generateCardNumber();
    await prisma.card.create({
      data: {
        cardNumber: expressCardNumber,
        slug: expressCardNumber.toLowerCase(),
        type: 'EXPRESS',
        status: 'ACTIVE',
        designTemplate: 'SIGNATURE',
        userId: demoUser.id,
        activatedAt: new Date(),
      },
    });
    console.log(`✅ Carte EXPRESS créée: ${expressCardNumber}`);

    // Carte BUSINESS
    const businessCardNumber = generateCardNumber();
    await prisma.card.create({
      data: {
        cardNumber: businessCardNumber,
        slug: businessCardNumber.toLowerCase(),
        type: 'BUSINESS',
        status: 'ACTIVE',
        designTemplate: 'SIGNATURE',
        userId: demoUser.id,
        activatedAt: new Date(),
      },
    });
    console.log(`✅ Carte BUSINESS créée: ${businessCardNumber}`);

    // Carte CUSTOM
    const customCardNumber = generateCardNumber();
    await prisma.card.create({
      data: {
        cardNumber: customCardNumber,
        slug: customCardNumber.toLowerCase(),
        type: 'CUSTOM',
        status: 'ACTIVE',
        designTemplate: 'PREMIUM',
        userId: demoUser.id,
        activatedAt: new Date(),
      },
    });
    console.log(`✅ Carte CUSTOM créée: ${customCardNumber}`);

    // ============================================
    // 4. Résumé
    // ============================================
    console.log('\n🎉 Seed complété avec succès!');
    console.log('\n📋 Résumé:');
    console.log(`   📧 Admin: admin@exemple.cm`);
    console.log(`   🔑 Mot de passe admin: admin123`);
    console.log(`   📧 User démo: jean@exemple.cm`);
    console.log(`   🔑 Mot de passe démo: ${tempPassword}`);
    console.log(`   💳 Total cartes créées: 4 (1 admin + 3 démo)`);
    console.log('\n🔗 URLs pour tester:');
    console.log(`   🎯 Admin: http://localhost:3000/admin`);
    console.log(`   🎯 Connexion: http://localhost:3000/login`);
    console.log(`   🎯 Profil EXPRESS: http://localhost:3000/p/${expressCardNumber.toLowerCase()}`);
    console.log(`   🎯 Profil BUSINESS: http://localhost:3000/p/${businessCardNumber.toLowerCase()}`);
    console.log(`   🎯 Profil CUSTOM: http://localhost:3000/p/${customCardNumber.toLowerCase()}`);
  } catch (error) {
    console.error('\n❌ Erreur lors du seed:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
