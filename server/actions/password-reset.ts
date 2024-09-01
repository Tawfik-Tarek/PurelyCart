"use server";

import { ResetFormSchema } from "@/types/reset-form";
import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generatePasswordResetToken } from "./tokens";
import { sendPasswordResetEmail } from "./email";

const action = createSafeActionClient();

export const passwordReset = action.schema(ResetFormSchema).action(async ({ parsedInput: { email } }) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    return {
      error: {
        message: "User not found",
      },
    };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken) {
    return {
      error: {
        message: "Token not generated",
      },
    };
  }
  await sendPasswordResetEmail(
    passwordResetToken[0].email,
    passwordResetToken[0].token
  );

  console.log("password", passwordResetToken);
  

  return {
    success: {
      message: "Email was sent , check your inbox 📩",
    },
  };
});
