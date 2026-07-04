import {sql} from "drizzle-orm";

export async function getAllVenuesByYear(
  db: any,
  yearId: number
) {
  return await db.all(sql`
    SELECT slug
    FROM tennisVenue
    WHERE yearId = ${yearId}
  `);
}