import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identifiant requis (username ou code carte)"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export type LoginInput = z.infer<typeof loginSchema>;
