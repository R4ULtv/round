import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./auth-schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
});
