// TAPAM CARD — Development seed
// Creates a test ADMIN and a test CLIENT with an activated card + profile,
// plus one PENDING card not yet assigned, to exercise the full MVP flow.

import { PrismaClient, Role, CardType, CardStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const APP_URL = process.env.APP_URL || 'http://localhost:3000'

async function main() {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 10)
  const clientPasswordHash = await bcrypt.hash('Client123!', 10)

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@tapam.card',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      mustChangePassword: false,
    },
  })

  const client = await prisma.user.upsert({
    where: { username: 'TPM-000001' },
    update: {},
    create: {
      username: 'TPM-000001',
      email: 'client@tapam.card',
      passwordHash: clientPasswordHash,
      role: Role.USER,
      mustChangePassword: false,
      profile: {
        create: {
          firstName: 'Jean Paul',
          lastName: 'Mahouli',
          jobTitle: 'Webmaster',
          company: 'TAPAM',
          bio: 'Créateur de solutions digitales innovantes.',
          phone: '+237698955741',
          whatsapp: '+237698955741',
          email: 'client@tapam.card',
          website: 'https://tapam.card',
        },
      },
    },
  })

  await prisma.card.upsert({
    where: { cardNumber: 'TPM-000001' },
    update: {},
    create: {
      cardNumber: 'TPM-000001',
      slug: 'tpm-000001',
      type: CardType.EXPRESS,
      status: CardStatus.ACTIVE,
      publicUrl: `${APP_URL}/p/tpm-000001`,
      activatedAt: new Date(),
      userId: client.id,
    },
  })

  await prisma.card.upsert({
    where: { cardNumber: 'TPM-000002' },
    update: {},
    create: {
      cardNumber: 'TPM-000002',
      slug: 'tpm-000002',
      type: CardType.CUSTOM,
      status: CardStatus.PENDING,
      publicUrl: `${APP_URL}/p/tpm-000002`,
    },
  })

  console.log('Seed completed:')
  console.log(`- Admin: admin / Admin123!`)
  console.log(`- Client: TPM-000001 / Client123!`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
