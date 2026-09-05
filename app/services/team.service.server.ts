import {StatusCodes} from "http-status-codes";
import {sql} from "drizzle-orm";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";
import {getFixturesByTeamId} from "~/repositories/fixture.repository.server";

export const getCoreTeamInformation = async (kv, db, yearId, teamSlug) => {
      const teams = await db.all(sql`
      SELECT
          tt.id,
          tt.name,
          tt.slug,
          tt.homeWeekday,
          LOWER(td.name) AS divisionSlug,
          td.name divisionName,
          tv.name venueName,
          tv.slug venueSlug,
      concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
      tp.slug secretarySlug
      FROM tennisTeam tt
               LEFT JOIN tennisDivision td ON tt.divisionId = td.id AND td.yearId = tt.yearId
               LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND td.yearId = tt.yearId
               LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
      WHERE tt.yearId = ${yearId}
        AND tt.slug = ${teamSlug}
  `)

  if (teams.length === 0) {
    return Response.json(`Unable to find team with slug '${teamSlug}'`, { status: StatusCodes.NOT_FOUND })
  }

  const team = teams[0]

  const players = await db.all(sql`
      SELECT
          concat(nameFirst, ' ', nameLast) AS name,
          tennisPlayer.rank,
          slug
      FROM tennisPlayer
      WHERE yearId = ${yearId}
        AND teamId = ${team.id}
  `)

  const weeks = await getAllWeeksByYear(db, yearId)
  const teamFixtures = await getFixturesByTeamId(kv, db, yearId, team.id)

  // Attach fixtures to weeks
  for (const week of weeks) {
    week.fixtures = teamFixtures.filter(fixture => fixture.weekId === week.id)
  }

    return {
    team,
    players,
    fixtures: teamFixtures,
    weeks
  }
}
