import { sql } from "drizzle-orm";
import {getCurrentYear} from "~/repositories/year.repository.server";

export async function getAllWeeksByYear (db, yearId) {

  const weeks = await db.all(sql`
      SELECT
          id,
          timeStart,
          type
      FROM tennisWeek
      WHERE yearId = ${yearId}
      ORDER BY timeStart ASC
  `)

  return weeks
}

export async function persistWeeks (db, weeks, fixtures) {

  const currentYear = await getCurrentYear(db)

  // clear all weekIds from tennisFixture table
  await db.run(sql`
      UPDATE tennisFixture
      SET weekId = NULL
      WHERE yearId = ${currentYear.id}
  `)

  // clear all weeks from tennisWeek table
  await db.run(sql`
      DELETE
      FROM tennisWeek
      WHERE yearId = ${currentYear.id}
  `)

  // insert weeks into this year
  for (const week of weeks) {
    await db.run(sql`
        INSERT INTO tennisWeek (id, yearId, timeStart, type)
        VALUES (
                ${week.id},
                ${currentYear.id},
                ${week.timeStart},
                ${week.type}
               )
    `)
  }

  // Group fixture IDs by weekId
  const weekToFixtureIds = {}
  for (const fixture of fixtures) {
    if (!weekToFixtureIds[fixture.weekId]) {
      weekToFixtureIds[fixture.weekId] = []
    }
    weekToFixtureIds[fixture.weekId].push(fixture.id)
  }

  // Update fixtures in batches per weekId
  for (const [weekId, fixtureIds] of Object.entries(weekToFixtureIds)) {
    if (fixtureIds.length === 0) continue
    const idsString = fixtureIds.join(',')
    await db.run(
    `
      UPDATE tennisFixture
      SET weekId = ${weekId}
      WHERE id IN (${idsString})
        AND yearId = ${currentYear.id}
    `)
  }
}

// export async function getAllWeeksByTeamId (yearId, teamId) {
//
//
//   // All weeks in the year except 'nothing' type
//   const [weeks] = await connection.execute(`
//       select
//           tw.id,
//           tw.type,
//           tw.timeStart
//       from tennisWeek tw
//       where tw.yearId = :yearId and type != :typeExclusion
//       order by tw.timeStart asc
//   `, {
//     yearId: yearId,
//     typeExclusion: WeekTypes.nothing
//   })

// @todo could be useful for frontend limited display
//  We want 1 week before and 3 weeks after the current week
// Look for the current closest week
// const now = dayjs()
// let closestWeek = null
//
// for (let i = 0; i < weeks.length; i++) {
//   const week = weeks[i]
//   const weekStart = dayjs.unix(week.timeStart)
//   if (now.isBefore(weekStart)) {
//     break
//   }
//   closestWeek = week
// }
//
// let weeksFeatured = []
// if (closestWeek) {
//   const closestIndex = weeks.findIndex(week => week.id === closestWeek.id)
//   const startIndex = Math.max(0, closestIndex - 1)
//   const endIndex = Math.min(weeks.length, closestIndex + 4)
//   weeksFeatured = weeks.slice(startIndex, endIndex)
// }

// connection.release()

// return weeks
// }
