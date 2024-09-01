"use server";

import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { getPasswordResetTokenByToken } from "./tokens";
import db from "..";
import { eq } from "drizzle-orm";
import { paswwordResetTokens, users } from "../schema";
import bcrypt from "bcrypt";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

const action = createSafeActionClient();

export const newPassword = action
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const dbPool = drizzle(pool);

    if (!token) {
      return {
        error: {
          message: "token is required",
        },
      };
    }

    const existingToken = await getPasswordResetTokenByToken(token);
    if (!existingToken) {
      return {
        error: {
          message: "token not found",
        },
      };
    }

    const isExpired = new Date(existingToken.expires) < new Date();
    if (isExpired) {
      return {
        error: {
          message: "token has expired",
        },
      };
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return {
        error: {
          message: "user not found",
        },
      };
    }

    const hashedPasssword = await bcrypt.hash(password, 10);

    await dbPool.transaction(async (tx) => {
      await tx
        .update(users)
        .set({
          password: hashedPasssword,
        })
        .where(eq(users.id, existingUser.id));

      //Delete Token
      await tx
        .delete(paswwordResetTokens)
        .where(eq(paswwordResetTokens.id, existingToken.id));
    });
    return {
      success: {
        message: "Password Updated",
      },
    };
  });
