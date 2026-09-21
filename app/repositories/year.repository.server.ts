import { sql } from "drizzle-orm";
import { capitalizeFirstLetter } from "~/libraries/misc";

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

export async function getYearDivisionId(db, yearName, divisionSlug) {
  const yearDivisionIds = await db.all(
    sql`
      SELECT td.id AS divisionId,
             ty.id AS yearId
      FROM tennisDivision td
               LEFT JOIN tennisYear ty ON ty.id = td.yearId
      WHERE ty.name = ${yearName}
        AND td.name = ${capitalizeFirstLetter(divisionSlug)}
  `<any>,
  );

  if (yearDivisionIds.length === 0) {
    return;
  }

  return yearDivisionIds[0];
}

export async function getYearByName(db, name) {
  const years = await db.all(sql`
      SELECT id
      FROM tennisYear
      WHERE name = ${name}
  `);

  if (years.length === 0) {
    return;
  }

  return years[0];
}

export async function getAllYears(db) {
  const years = await db.all(`
      SELECT id, name
      FROM tennisYear
      WHERE name != '2012'
      ORDER BY id ASC
  `);

  return years;
}

/**
 * Not 100% confident that this is a good location for this
 * It is a loader helper of some kind, because it has the response like that
 */
export async function parseYearDivisionId(
  db: any,
  year: string,
  division: string,
) {
  const yearDivisionId = await getYearDivisionId(db, year, division);

  if (!yearDivisionId) {
    throw Error(
      `Unable to find division with year name '${year}' and slug '${division}'`,
    );
  }

  return yearDivisionId;
}

export async function parseYearNameGetYear(db: any, year: string) {
  const currentYear = await getYearByName(db, year);

  if (!currentYear) {
    throw Error(`Unable to find year with name '${year}'`);
  }

  return currentYear;
}
