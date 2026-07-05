import {getYearByName, getYearDivisionId} from "~/repositories/year.repository.server";

/**
 * Not 100% confident that this is a good location for this
 * It is a loader helper of some kind, because it has the response like that
 */
export async function parseYearDivisionId(db: any, year: string, division: string) {
  const yearDivisionId = await getYearDivisionId(db, year, division)

  if (!yearDivisionId) {
    throw Error(`Unable to find division with year name '${year}' and slug '${division}'`)
  }

  return yearDivisionId
}

export async function parseYearNameGetYear(db: any, year: string) {
    const currentYear = await getYearByName(db, year)

  if (!currentYear) {
    throw Error(`Unable to find year with name '${year}'`)
  }

  return currentYear
}
