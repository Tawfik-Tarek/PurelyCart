"use server";

import db from "@/server/index";
import { eq } from "drizzle-orm";
import { emailTokens, paswwordResetTokens, twoFactorTokens, users } from "@/server/schema";
import crypto from 'crypto'

const getVerificationTokenByEmail = async (email: string) => {
  try {
    const token = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });
    return token;
  } catch (err) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const currentToken = await getVerificationTokenByEmail(email);
  if (currentToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, currentToken.id));
  }
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email: email,
      token: token,
      expires,
    })
    .returning();
  return verificationToken;
};

export const verifyEmailToken = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);
  if (!existingToken) {
    return {
      error: {
        message: "Token Not Found",
      },
    };
  }
  const isExpired = new Date(existingToken.expires) < new Date();
  if (isExpired) {
    if (!existingToken) {
      return {
        error: {
          message: "Token is expired",
        },
      };
    }
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  if (!existingUser) {
    return {
      error: {
        message: "Emai dose not exist",
      },
    };
  }

  //there is a user

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.email, existingToken.email));
  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));

  return {
    success: {
      message: "Email veified",
    },
  };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.paswwordResetTokens.findFirst({
      where: eq(paswwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch (err) {
    return null;
  }
};


export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });

    return twoFactorToken;
  } catch (err) {
    return null;
  }
};

export const getResetTokenByEmail = async (email: string) => {
  const token = await db.query.paswwordResetTokens.findFirst({
    where: eq(paswwordResetTokens.email, email),
  });
  return token;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const currentToken = await getResetTokenByEmail(email);
  if (currentToken) {
    await db
      .delete(paswwordResetTokens)
      .where(eq(paswwordResetTokens.id, currentToken.id));
  }
  const passwordResetToken = await db
    .insert(paswwordResetTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return passwordResetToken;
};


export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_00 , 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const currentToken = await getTwoFactorTokenByEmail(email);
  if (currentToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.email, currentToken.email));
  }
  const twoFactorToken = await db
    .insert(twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return twoFactorToken;
};