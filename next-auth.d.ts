import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendUser = DefaultSession["user"] & {
  id: string;
  image: string;
  role: string;
  isTwoFactorEnabled: boolean;
  isOuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendUser;
  }
}
