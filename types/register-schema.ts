import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address",
  }),
  name : z.string().min(4 , {
    message: "Please add a name with at least 4 characters"
  }),
  password: z.string().min(8, {
    message: "Password should be 8 digits at least",
  }),
  code: z.optional(z.string()),
});
