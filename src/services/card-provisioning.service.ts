import bcrypt from "bcryptjs";
import { CardType, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { appUrl } from "@/lib/env";

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
export function createTemporaryPassword(length = 10) { return Array.from({ length }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join(""); }
export function numberToCardNumber(sequence: number) { return `TPM-${String(sequence).padStart(6, "0")}`; }

export class CardProvisioningService {
  static async create(input: { type: CardType; userId?: string; email?: string; phone?: string }) {
    return prisma.$transaction(async (tx) => {
      const latest = await tx.card.findFirst({ orderBy: { cardNumber: "desc" }, select: { cardNumber: true } });
      const next = latest ? Number(latest.cardNumber.slice(4)) + 1 : 1;
      const cardNumber = numberToCardNumber(next);
      const slug = cardNumber.toLowerCase();
      const password = createTemporaryPassword();
      let userId = input.userId;
      if (!userId) {
        const passwordHash = await bcrypt.hash(password, 12);
        const user = await tx.user.create({ data: { username: cardNumber, passwordHash, email: input.email || null, phone: input.phone || null, mustChangePassword: true } });
        userId = user.id;
        await tx.profile.create({ data: { userId } });
      }
      const card = await tx.card.create({ data: { cardNumber, slug, type: input.type, userId, status: "ACTIVE", activatedAt: new Date() } });
      return { card, username: cardNumber, temporaryPassword: password, publicUrl: `${appUrl}/p/${slug}` };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}
