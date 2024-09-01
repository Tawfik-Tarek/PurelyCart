import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/server";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { accounts, users } from "./schema";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";


export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db) as any,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
        session.user.isOuth = token.isOuth as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, token.sub),
      });
      token.isOuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;
      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    }),
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      async authorize(credentials) {
        const validateData = LoginSchema.safeParse(credentials);
        if (validateData.success) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, validateData.data.email),
          });
          if (user) {
            return user;
          }
          return null;
        } else {
          return null;
        }
      },
    }),
  ],
});
