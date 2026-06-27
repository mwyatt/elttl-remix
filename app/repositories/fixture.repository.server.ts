import { sql } from "drizzle-orm";

export async function getFixturesByWeekId (db, yearId, weekId) {
  const fixtures = await db.all(`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight,
        timeFulfilled,
        ttd.name divisionName
        from tennisEncounter tte
      inner join tennisFixture ttf on ttf.id = tte.fixtureId
                                          and ttf.yearId = tte.yearId
                                          and ttf.weekId = ${weekId}
                                          and timeFulfilled is not null
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
        left join tennisDivision ttd on ttd.id = ttl.divisionId and ttd.yearId = tte.yearId
    where tte.yearId = ${yearId}
    and status != 'exclude'
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled, divisionName
  `)

  return fixtures
}

export async function getUnfulfilledFixtures (db, yearId) {
  const fixtures = await db.all(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             '0'      scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
             '0'      scoreRight,
             timeFulfilled
      from tennisFixture ttf
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
      where ttf.yearId = ${yearId}
        and ttf.timeFulfilled is null
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `)

  return fixtures
}

export async function getUnfulfilledFixturesByWeekId (db, yearId, weekId) {
  const fixtures = await db.all(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             '0'      scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
             '0'      scoreRight,
             timeFulfilled,
                     ttd.name divisionName
      from tennisFixture ttf
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
              left join tennisDivision ttd on ttd.id = ttl.divisionId and ttd.yearId = ttf.yearId
      where ttf.yearId = ${yearId}
        and ttf.weekId = ${weekId}
        and ttf.timeFulfilled is null
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled, divisionName
  `)

  return fixtures
}

export async function getFixturesByTeamId (db, yearId, teamId) {
  const fixtures = await db.all(`
      select ttl.name teamLeftName,
             ttl.slug teamLeftSlug,
             ttl.homeWeekday,
             tv.name venueName,
             tv.slug venueSlug,
             tv.location venueLocation,
            sum(scoreLeft) scoreLeft,
             ttr.name teamRightName,
             ttr.slug teamRightSlug,
            sum(scoreRight) scoreRight,
             timeFulfilled,
             weekId
      from tennisFixture ttf
          left join tennisEncounter te on te.fixtureId = ttf.id
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = ttf.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = ttf.yearId
               left join tennisWeek tw on tw.id = ttf.weekId and tw.yearId = ttf.yearId
                left join tennisVenue tv on tv.id = ttl.venueId and tv.yearId = ttl.yearId
      where ttf.yearId = ${yearId}
        and (ttf.teamIdLeft = ${teamId} OR ttf.teamIdRight = ${teamId})
      group by ttf.id, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled, weekId, ttl.homeWeekday, venueName, venueSlug, venueLocation
  `)

  return fixtures
}
