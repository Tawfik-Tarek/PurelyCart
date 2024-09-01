import * as z from "zod";

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(8, {
        message: "Password should be 8 digits at least",
      })
    ),
    newPassword: z.optional(
      z.string().min(8, {
        message: "Password should be 8 digits at least",
      })
    ),

    image: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "new password is required", path: ["newPassword"] }
  );
