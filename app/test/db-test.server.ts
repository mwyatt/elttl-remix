import {getDb} from "~/db.server"
import {sql} from "drizzle-orm";

let _db: ReturnType<typeof getDb> | null = null;

export function getDbFilePath(): string {
  return `file:./db/local-test-2.db`
}

export function getTestDb() {
  if (_db) return _db;

  const tursoUrl =
    process.env.TURSO_URL ?? getDbFilePath();

  _db = getDb({
    TURSO_URL: tursoUrl,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
  });

  return _db;
}

export async function resetTestDb() {
  const db = getTestDb()

  // Delete in FK-safe order
  await db.run(sql`DELETE FROM tennisEncounter`)
  await db.run(sql`DELETE FROM tennisFixture`)
  await db.run(sql`DELETE FROM tennisPlayer`)
  await db.run(sql`DELETE FROM tennisDivision`)
  await db.run(sql`DELETE FROM tennisTeam`)
  await db.run(sql`DELETE FROM tennisVenue`)
  await db.run(sql`DELETE FROM tennisWeek`)
  await db.run(sql`DELETE FROM options`)
  await db.run(sql`DELETE FROM tennisYear`)
}