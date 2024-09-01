"use server"; // don't forget to add this!
import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import db from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "./email";

const action = createSafeActionClient();

export const emailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, name, password } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return {
          success: {
            message: "Email Confirmation resent",
          },
        };
      }
      return {
        error: {
          message: "Email already in use",
        },
      };
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      email: email,
      name: name,
      password: hasedPassword,
    });
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );
    return {
      success: {
        message: "Email Confirmation sent",
      },
    };
  });
