import { sql } from "drizzle-orm";

export async function getCurrentYear(db: any) {
  const result = await db.all(sql`
    select ty.id, ty.name
    from options o
    inner join tennisYear ty on ty.id = o.value
    where o.name = 'year_id'
  `);

  return result[0];
}