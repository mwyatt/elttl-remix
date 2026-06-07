import { sql } from "drizzle-orm";

export async function playerGetMany(db: any, yearId: number, playerIds: number[]) {
  if (playerIds.length === 0) return [];

  return db.all(sql`
    SELECT
      id,
      tp.rank
    FROM tennisPlayer tp
    WHERE yearId = ${yearId}
      AND id IN (${sql.join(playerIds.map((id) => sql`${id}`), sql`, `)})
  `);
}

export async function playerGetBySlugs(db: any, yearId: number, slugs: string[]) {
  if (slugs.length === 0) return [];

  return db.all(sql`
    SELECT
      id,
      nameFirst || ' ' || nameLast AS name,
      slug,
      phoneLandline,
      phoneMobile
    FROM tennisPlayer tp
    WHERE yearId = ${yearId}
      AND slug IN (${sql.join(slugs.map((slug) => sql`${slug}`), sql`, `)})
  `);
}

export async function playerGetAll(db: any, yearId: number) {
  return db.all(sql`
    SELECT
      id,
      tp.rank,
      nameFirst || ' ' || nameLast AS name
    FROM tennisPlayer tp
    WHERE yearId = ${yearId}
    ORDER BY tp.nameLast ASC
  `);
}