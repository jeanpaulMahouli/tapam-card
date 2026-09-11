import bcrypt from "bcryptjs";
import { CardType, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/env";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export function createTemporaryPassword(length = 10) {
  return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
}

// Alphabet dédié au code de carte : majuscules + chiffres uniquement,
// sans caractères ambigus (0/O, 1/I) pour rester lisible à l'oral/écrit.
const CARD_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CARD_CODE_PREFIX = "TPM";
const CARD_CODE_RANDOM_LENGTH = 6;
const MAX_GENERATION_ATTEMPTS = 10;

/**
 * Génère un identifiant de carte aléatoire non séquentiel, du type "TPMXFS45F".
 * Format : préfixe "TPM" + 6 caractères aléatoires (lettres majuscules + chiffres).
 */
export function generateRandomCardNumber() {
  let code = "";
  for (let i = 0; i < CARD_CODE_RANDOM_LENGTH; i++) {
    code += CARD_CODE_ALPHABET[Math.floor(Math.random() * CARD_CODE_ALPHABET.length)];
  }
  return `${CARD_CODE_PREFIX}${code}`;
}

/** @deprecated Conservé pour compatibilité/historique (ancien format séquentiel TPM-000001). */
export function numberToCardNumber(sequence: number) {
  return `TPM-${String(sequence).padStart(6, "0")}`;
}

export class CardProvisioningService {
  static async create(input: { type: CardType; userId?: string; email?: string; phone?: string }) {
    return prisma.$transaction(
      async (tx) => {
        const { cardNumber, slug } = await this.generateUniqueCardIdentifiers(tx);
        const password = createTemporaryPassword();
        let userId = input.userId;
        if (!userId) {
          const passwordHash = await bcrypt.hash(password, 12);
          const user = await tx.user.create({
            data: {
              username: cardNumber,
              passwordHash,
              email: input.email || null,
              phone: input.phone || null,
              mustChangePassword: true,
            },
          });
          userId = user.id;
          await tx.profile.create({ data: { userId } });
        }
        const card = await tx.card.create({
          data: { cardNumber, slug, type: input.type, userId, status: "ACTIVE", activatedAt: new Date() },
        });
        return { card, username: cardNumber, temporaryPassword: password, publicUrl: `${appUrl}/p/${slug}` };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }

  /**
   * Génère un couple (cardNumber, slug) aléatoire et garantit son unicité en base,
   * avec plusieurs tentatives en cas de collision (probabilité très faible).
   */
  private static async generateUniqueCardIdentifiers(
    tx: Prisma.TransactionClient
  ): Promise<{ cardNumber: string; slug: string }> {
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
      const cardNumber = generateRandomCardNumber();
      const slug = cardNumber.toLowerCase();
      const existing = await tx.card.findFirst({
        where: { OR: [{ cardNumber }, { slug }] },
        select: { id: true },
      });
      if (!existing) {
        return { cardNumber, slug };
      }
    }
    throw new Error("Impossible de générer un identifiant de carte unique après plusieurs tentatives.");
  }
}
