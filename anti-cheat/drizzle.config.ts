import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
    schema: "./src/drizzle/schema.ts",
    dbCredentials: {
      url: process.env.DATABASE_URL as string
  }
});
