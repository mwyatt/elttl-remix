import {sql} from "drizzle-orm";
import EncounterStatus from "~/constants/EncounterStatus";

export async function getYearDivisionMeritEncounters(
  kv: any,
  db: any,
  yearId: number,
  divisionId: number,
) {
    const cacheKey = `division-merit-encounters-${yearId}-${divisionId}`
  let cached = await kv.get(cacheKey, { type: "json" });
  if (!cached) {
    const meritEncounters = await db.all(sql`
      select
          ttl.name teamLeftName,
          ttl.slug teamLeftSlug,
          concat(tpl.nameFirst, ' ', tpl.nameLast) AS playerLeftName,
          tpl.id playerLeftId,
          tpl.slug playerLeftSlug,
          tpl.rank playerLeftRank,
          tte.scoreLeft,
          ttr.name teamRightName,
          ttr.slug teamRightSlug,
          concat(tpr.nameFirst, ' ', tpr.nameLast) AS playerRightName,
          tpr.id playerRightId,
          tpr.slug playerRightSlug,
          tpr.rank playerRightRank,
          tte.scoreRight                                                                  
          from tennisEncounter tte
        left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
          left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
          left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
          left join tennisPlayer tpl on tpl.id = tte.playerIdLeft and tpl.yearId = tte.yearId
          left join tennisPlayer tpr on tpr.id = tte.playerIdRight and tpr.yearId = tte.yearId
      where tte.yearId = ${yearId}
      and status != 'exclude'
      and ttl.divisionId = ${divisionId}
      
      -- exclude absent players
      and tpl.id > 0
      and tpr.id > 0
    `)

    console.warn('cache: setting cache key', cacheKey)
    await kv.put(cacheKey, JSON.stringify(meritEncounters))
    cached = meritEncounters
  } else {
    console.warn('cache: using cache key', cacheKey)
  }

  return cached
}

export async function getRankMeritEncountersByDivisionId (db, yearId, divisionId) {
  const encounters = await db.all(sql`
    select
        tte.id,
        tte.playerIdLeft,
        tte.playerRankChangeLeft,
        tte.scoreLeft,
        tte.playerIdRight,
        tte.playerRankChangeRight,
        tte.scoreRight
    from tennisEncounter tte
    left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
    left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
    where tte.yearId = ${yearId}
    and status != 'exclude'
    and tte.playerIdLeft > 0
    and tte.playerIdRight > 0
    and ttl.divisionId = ${divisionId}
  `)

  return encounters
}

export async function getPlayerEncounters (kv, db, yearId, playerId) {
  const cacheKey = `encounters-by-player-id-${yearId}-${playerId}`
  let cached = await kv.get(cacheKey, { type: "json" });
  if (!cached) {
    const encounters = await db.all(sql`
        select tte.id,
               scoreLeft,
               scoreRight,
               CONCAT(ttpl.nameFirst, ' ', ttpl.nameLast) playerLeftName,
               ttpl.slug                                  playerLeftSlug,
               CONCAT(ttpr.nameFirst, ' ', ttpr.nameLast) playerRightName,
               ttpr.slug                                  playerRightSlug,
               playerRankChangeLeft,
               playerRankChangeRight
        from tennisEncounter tte
                 left join tennisPlayer ttpl on ttpl.id = tte.playerIdLeft and ttpl.yearId = tte.yearId
                 left join tennisPlayer ttpr on ttpr.id = tte.playerIdRight and ttpr.yearId = tte.yearId
        where tte.yearId = ${yearId}
          and (tte.playerIdLeft = ${playerId} OR tte.playerIdRight = ${playerId})
    `)

    console.warn('cache: setting cache key', cacheKey)
    await kv.put(cacheKey, JSON.stringify(encounters))
    cached = encounters
  } else {
    console.warn('cache: using cache key', cacheKey)
  }

  return cached
}

export async function getDivisionLeagueTable (kv, db, yearId, divisionId) {
  const cacheKey = `division-league-table-${yearId}-${divisionId}`
  let cached = await kv.get(cacheKey, { type: "json" });
  if (!cached) {
  const leagueTable = await db.all(sql`
      select ttl.name        teamLeftName,
             ttl.slug        teamLeftSlug,
             sum(scoreLeft)  scoreLeft,
             ttr.name        teamRightName,
             ttr.slug        teamRightSlug,
             sum(scoreRight) scoreRight
      from tennisEncounter tte
               left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = ${yearId}
        and status != 'exclude'
        and ttl.divisionId = ${divisionId}
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug
  `)

    console.warn('cache: setting cache key', cacheKey)
    await kv.put(cacheKey, JSON.stringify(leagueTable))
    cached = leagueTable
  } else {
    console.warn('cache: using cache key', cacheKey)
  }

  return cached
}

export async function getTeamsFulfilledFixtures (kv, db, yearId, teamIds) {
  const cacheKey = `teams-fulfilled-fixtures-${yearId}-${teamIds.join('')}`
  let cached = await kv.get(cacheKey, { type: "json" });
  if (!cached) {
  const response = await db.all(sql`
      select ttl.name        teamLeftName,
             ttl.slug        teamLeftSlug,
             sum(scoreLeft)  scoreLeft,
             ttr.name        teamRightName,
             ttr.slug        teamRightSlug,
             sum(scoreRight) scoreRight,
             timeFulfilled
      from tennisEncounter tte
               inner join tennisFixture ttf on ttf.id = tte.fixtureId
          and ttf.yearId = tte.yearId
          and ttf.teamIdLeft in (${sql.join(teamIds, sql`, `)})
               left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
               left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
      where tte.yearId = ${yearId}
        and status != 'exclude'
      group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug, timeFulfilled
  `)

    console.warn('cache: setting cache key', cacheKey)
    await kv.put(cacheKey, JSON.stringify(response))
    cached = response
  } else {
    console.warn('cache: using cache key', cacheKey)
  }

  return cached
}

export async function getDoublesMeritTable (kv, db, yearId, divisionId) {
  const cacheKey = `doubles-merit-table-${yearId}-${divisionId}`
  let cached = await kv.get(cacheKey, { type: "json" });
  if (!cached) {
  const response = await db.all(sql`
    select
        ttl.name teamLeftName,
        ttl.slug teamLeftSlug,
        sum(scoreLeft) scoreLeft,
        ttr.name teamRightName,
        ttr.slug teamRightSlug,
        sum(scoreRight) scoreRight
        from tennisEncounter tte
      left join tennisFixture ttf on ttf.id = tte.fixtureId and ttf.yearId = tte.yearId
        left join tennisTeam ttl on ttl.id = ttf.teamIdLeft and ttl.yearId = tte.yearId
        left join tennisTeam ttr on ttr.id = ttf.teamIdRight and ttr.yearId = tte.yearId
    where tte.yearId = ${yearId}
    and status = ${EncounterStatus.DOUBLES}
    and ttl.divisionId = ${divisionId}
    group by fixtureId, teamLeftName, teamRightName, teamLeftSlug, teamRightSlug
  `)

    console.warn('cache: setting cache key', cacheKey)
    await kv.put(cacheKey, JSON.stringify(response))
    cached = response
  } else {
    console.warn('cache: using cache key', cacheKey)
  }

  return cached
}