import { getDb } from "~/db.server"

export function getTestDb() {
  return getDb({
    TURSO_URL: process.env.TURSO_URL,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN
  })
}