import {sql} from "drizzle-orm";

export async function getAllTeamsByYear(
  db: any,
  yearId: number
) {
  return await db.all(sql`
    SELECT slug
    FROM tennisTeam
    WHERE yearId = ${yearId}
  `);
}