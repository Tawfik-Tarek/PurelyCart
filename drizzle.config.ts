import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load environment variables from .env.local file
dotenv.config({
    path: ".env.local",
});

export default defineConfig({
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
});
