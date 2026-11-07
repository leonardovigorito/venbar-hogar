import path from "node:path";
import { defineConfig } from "prisma/config";

const DB_PATH = path.join(process.cwd(), "prisma", "venbar.db");

function resolveDatasourceUrl(): string {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  if (!tursoUrl) return `file:${DB_PATH}`;
  const token = process.env.TURSO_AUTH_TOKEN;
  return token ? `${tursoUrl}?authToken=${token}` : tursoUrl;
}

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: resolveDatasourceUrl(),
  },
});
