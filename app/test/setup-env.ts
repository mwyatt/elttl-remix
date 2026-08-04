import {getDbFilePath, getTestDb} from "~/test/db-test.server";
import fs from "node:fs/promises";
import path from "node:path";
import * as process from "node:process";

process.env.TURSO_URL = getDbFilePath();
delete process.env.TURSO_AUTH_TOKEN;
process.env.NODE_ENV = "test";

const db = getTestDb();
const schemaPath = path.resolve(process.cwd(), "drizzle/000_initial.sql");
let schemaSql = await fs.readFile(schemaPath, "utf8");

// Split setup into individual statements and run each
const statements = schemaSql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

for (const statement of statements) {
  await db.run(statement);
}
