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

export async function getTeamsByIds(db: any, yearId: number, ids: number[]) {
  if (ids.length === 0) return [];

  return db.all(sql`
    SELECT
      id,
      name
    FROM tennisTeam
    WHERE yearId = ${yearId}
      AND id IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})
  `);
}

export async function getTeamById(db: any, yearId: number, id: number) {
  const rows = await db.all(sql`
    SELECT
      id,
      name,
      divisionId
    FROM tennisTeam
    WHERE yearId = ${yearId}
      AND id = ${id}
  `);

  return rows[0];
}