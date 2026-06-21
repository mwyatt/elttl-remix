import { sql } from "drizzle-orm"
import { getTestDb } from "./db-test.server"

export async function resetTestDb() {
  const db = getTestDb()

  // Delete in FK-safe order
  await db.run(sql`DELETE FROM tennisEncounter`)
  await db.run(sql`DELETE FROM tennisFixture`)
  await db.run(sql`DELETE FROM tennisPlayer`)
  await db.run(sql`DELETE FROM tennisTeam`)
  await db.run(sql`DELETE FROM tennisVenue`)
  await db.run(sql`DELETE FROM tennisWeek`)
  await db.run(sql`DELETE FROM options`)
  await db.run(sql`DELETE FROM tennisYear`)
}