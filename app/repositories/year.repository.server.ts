import { sql } from "drizzle-orm";
import {capitalizeFirstLetter} from "~/libraries/misc";

export async function getCurrentYear(db: any) {
  const result = await db.all(sql`
    select ty.id, ty.name
    from options o
    inner join tennisYear ty on ty.id = o.value
    where o.name = 'year_id'
  `);

  return result[0];
}

export async function getLatestYear(db: any) {
  const result = await db.all(sql`
    select * from tennisYear
    order by id desc
  `);

  return result[0];
}

export async function getYearDivisionId (db, yearName, divisionSlug) {
  const yearDivisionIds = await db.all(sql`
      SELECT td.id AS divisionId,
             ty.id AS yearId
      FROM tennisDivision td
               LEFT JOIN tennisYear ty ON ty.id = td.yearId
      WHERE ty.name = ${yearName}
        AND td.name = ${capitalizeFirstLetter(divisionSlug)}
  `<any>)

  if (yearDivisionIds.length === 0) {
    return
  }

  return yearDivisionIds[0]
}

export async function getYearByName (db, name) {
  const years = await db.all(sql`
      SELECT id
      FROM tennisYear
      WHERE name = ${name}
  `)

  if (years.length === 0) {
    return
  }

  return years[0]
}
