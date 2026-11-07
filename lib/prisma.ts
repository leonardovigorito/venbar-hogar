import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const adapter = tursoUrl
    ? new PrismaLibSql({ url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN })
    : new PrismaLibSql({ url: `file:${path.join(process.cwd(), "prisma", "venbar.db")}` });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
