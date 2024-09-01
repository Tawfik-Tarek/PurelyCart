import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
  password: z.string().min(1, {
    message: "Short Password",
  }),
  code: z.optional(z.string()),
});
