"use server"; // don't forget to add this!

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import db from "..";
import { eq, and } from "drizzle-orm";
import { twoFactorTokens, users } from "../schema";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { signIn } from "../auth";

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      return {
        error: {
          message: "User dose not exist",
        },
      };
    }

    if (existingUser.password === null) {
      return {
        error: {
          message: "You have signed up with a social account",
        },
      };
    }

    const isMatch = await bcrypt.compare(password, existingUser.password!);
    if (isMatch) {
      if (existingUser.emailVerified) {
        if (existingUser.twoFactorEnabled) {
          if (code) {
            const token = await getTwoFactorTokenByEmail(existingUser.email);
            if (!token) {
              return {
                error: {
                  message: "Invalid Token",
                },
              };
            }
            if (token.token !== code) {
              console.log(`token is ${token.token} and code is ${code}`);

              return {
                error: {
                  message: "Invalid Code",
                },
              };
            }
            const isExpired = new Date(token.expires) < new Date();
            if (isExpired) {
              return {
                error: {
                  message: "Token has expired!",
                },
              };
            }
            await db
              .delete(twoFactorTokens)
              .where(eq(twoFactorTokens.id, token.id));
          } else {
            const token = await generateTwoFactorToken(existingUser.email);

            if (!token) {
              return { error: { message: "Token not generated!" } };
            }

            await sendTwoFactorTokenByEmail(token[0].email, token[0].token);
            return {
              twoFactor: {
                message: "Two Factor Token Sent!",
              },
            };
          }
        }

        await signIn("credentials", {
          email,
          password,
          redirectTo: "/",
        });

        return {
          success: {
            message: "Login Done Successfully",
          },
        };
      } else {
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
    } else {
      return {
        error: {
          message: "Email Or Password is incorrect",
        },
      };
    }
  });
