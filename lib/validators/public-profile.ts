import { z } from "zod";

export const publicProfileParamsSchema = z.object({
  slug: z.string().min(1).max(100),
});

export type PublicProfileParams = z.infer<typeof publicProfileParamsSchema>;
