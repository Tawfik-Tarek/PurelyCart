import { z } from "zod";

export const ResetFormSchema = z.object({
  email: z.string().email({
    message: "This email is invalid",
  }),
});
