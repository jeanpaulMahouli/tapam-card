import { z } from "zod";

/**
 * Schéma de validation pour la mise à jour du profil utilisateur
 * Valide les champs essentiels du profil professionnel
 */
export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  lastName: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z
    .string()
    .email("Email invalide"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{7,}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  jobTitle: z
    .string()
    .max(100, "Le titre professionnel ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Le nom de l'entreprise ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "La biographie ne peut pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  avatarUrl: z
    .string()
    .url("URL de l'avatar invalide")
    .optional()
    .or(z.literal("")),
  location: z
    .string()
    .max(100, "La localisation ne peut pas dépasser 100 caractères")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .url("URL du site web invalide")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Schéma de validation pour l'ajout/modification d'un service (lien/réseau social)
 */
export const createServiceSchema = z.object({
  type: z.enum(["PHONE", "EMAIL", "WEBSITE", "LINKEDIN", "TWITTER", "INSTAGRAM", "FACEBOOK", "GITHUB", "WHATSAPP", "CUSTOM"], {
    errorMap: () => ({ message: "Type de service invalide" }),
  }),
  label: z
    .string()
    .min(1, "Le libellé est requis")
    .max(50, "Le libellé ne peut pas dépasser 50 caractères"),
  value: z
    .string()
    .min(1, "La valeur est requise")
    .max(500, "La valeur ne peut pas dépasser 500 caractères"),
  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
  isVisible: z
    .boolean()
    .optional()
    .default(true),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

/**
 * Schéma de validation pour la modification d'un service
 */
export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().min(1, "L'ID du service est requis"),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
