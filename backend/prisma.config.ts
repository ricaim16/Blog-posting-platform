// prisma.config.ts
import "dotenv/config";  // ← This loads your .env file automatically

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",  // ← path to your schema (adjust if it's in a subfolder)

  datasource: {
    url: env("DATABASE_URL"),  // ← reads from .env — throws if missing (good for safety)
    // Optional: if you use a shadow DB for migrations
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },

  // Optional: customize migrations
  migrations: {
    path: "prisma/migrations",
    // seed: "ts-node prisma/seed.ts",  // or tsx / node if you have a seed script
  },
});