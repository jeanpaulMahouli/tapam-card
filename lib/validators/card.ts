import { z } from "zod";
import { CardType, CardStatus } from "@prisma/client";

export const createCardSchema = z.object({
  cardType: z.enum([CardType.NFC, CardType.QR_CODE, CardType.BADGE, CardType.KEYCHAIN]),
  serialNumber: z.string().min(1, "Serial number is required"),
  label: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const updateCardSchema = z.object({
  label: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  status: z.enum([CardStatus.ACTIVE, CardStatus.INACTIVE, CardStatus.REVOKED]).optional(),
});

export const activateCardSchema = z.object({
  cardId: z.string().min(1, "Card ID is required"),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type ActivateCardInput = z.infer<typeof activateCardSchema>;
