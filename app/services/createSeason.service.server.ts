import {getCurrentYear} from "~/repositories/year.repository.server";
import {sql} from "drizzle-orm"

export default async function createSeason (db) {
  const currentYear = await getCurrentYear(db);

  const newYearName = parseInt(currentYear.name) + 1
  const newYearId = parseInt(currentYear.id) + 1

  await db.transaction(async (tx) => {
    // Create new year entry
    const yearResult = await tx.run(sql`
      INSERT INTO tennisYear (id, name, value)
      VALUES (${newYearId}, ${newYearName}, '')
    `)

    // Copy divisions
    const divisionResult = await tx.run(sql`
      INSERT INTO tennisDivision (id, name, yearId)
      SELECT id, name, ${newYearId}
      FROM tennisDivision
      WHERE yearId = ${currentYear.id}
    `)

    // Copy teams
    const teamResult = await tx.run(sql`
      INSERT INTO tennisTeam (id, yearId, name, slug, homeWeekday, secretaryId, venueId, divisionId)
      SELECT id, ${newYearId}, name, slug, homeWeekday, secretaryId, venueId, divisionId
      FROM tennisTeam
      WHERE yearId = ${currentYear.id}
    `)

    // Copy venues
    const venueResult = await tx.run(sql`
      INSERT INTO tennisVenue (id, yearId, name, slug, location)
      SELECT id, ${newYearId}, name, slug, location
      FROM tennisVenue
      WHERE yearId = ${currentYear.id}
    `)

    // Copy players
    const playerResult = await tx.run(sql`
      INSERT INTO tennisPlayer (id, yearId, nameFirst, nameLast, slug, \`rank\`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId)
      SELECT id, ${newYearId}, nameFirst, nameLast, slug, \`rank\`, phoneLandline, phoneMobile, ettaLicenseNumber, teamId
      FROM tennisPlayer
      WHERE yearId = ${currentYear.id}
    `)

    const newYearIdString = newYearId.toString()

    // Update options table to point to the new year
    const optionsResult = await tx.run(sql`
      UPDATE options
      SET value = ${newYearIdString}
      WHERE name = 'year_id'
    `)

    return;
  });

  return {
    id: newYearId,
    name: newYearName
  }
}
