import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const dbPath = join(process.cwd(), "prisma", "dev.db");
const backupDir = join(process.cwd(), "backups");

if (!existsSync(dbPath)) {
  console.error("No se encontró prisma/dev.db. ¿Ya corriste `npx prisma migrate dev`?");
  process.exit(1);
}

if (!existsSync(backupDir)) {
  mkdirSync(backupDir);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = join(backupDir, `dev-${timestamp}.db`);

copyFileSync(dbPath, backupPath);
console.log(`Respaldo creado en: ${backupPath}`);
