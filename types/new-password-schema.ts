import { z } from "zod";

export const NewPasswordSchema = z.object({
  password: z.string().min(8, "Password should be 8 digits at least"),
  token: z.string().nullable().optional(),
});
