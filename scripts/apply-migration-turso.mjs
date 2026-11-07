import { createClient } from "@libsql/client";
import { readFileSync } from "node:fs";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Faltan TURSO_DATABASE_URL / TURSO_AUTH_TOKEN en el entorno.");
  process.exit(1);
}

const client = createClient({ url, authToken });

const sqlPath = process.argv[2];
if (!sqlPath) {
  console.error("Uso: node scripts/apply-migration-turso.mjs <ruta-al-migration.sql>");
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf-8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await client.execute(statement);
  console.log("OK:", statement.slice(0, 60).replace(/\s+/g, " ") + "...");
}

console.log(`Migración aplicada: ${statements.length} sentencias.`);
