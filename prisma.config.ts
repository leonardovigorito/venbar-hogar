import path from "node:path";
import { defineConfig } from "prisma/config";

const DB_PATH = path.join(process.cwd(), "prisma", "venbar.db");

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: `file:${DB_PATH}`,
  },
});
