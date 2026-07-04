import {sql} from "drizzle-orm";

export async function getAllDivisionsByYear(
  db: any,
  yearId: number
) {
  return await db.all(sql`
    SELECT *
    FROM tennisDivision
    WHERE yearId = ${yearId}
  `);
}