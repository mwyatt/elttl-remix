import {sql} from "drizzle-orm";

export async function getYearDivisionMeritEncounters(
  db: any,
  yearId: number,
  divisionId: number,
) {
  return await db.all(sql`
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