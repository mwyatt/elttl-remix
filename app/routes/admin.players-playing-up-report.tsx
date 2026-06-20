import { Link } from "react-router";
import {linkStyles} from "~/styles/ui-classes";
import {getDbFromContext} from "~/db-context.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import map from "lodash/map";
import uniq from "lodash/uniq";
import each from "lodash/each";
import difference from "lodash/difference";
import uniqBy from "lodash/uniqBy";
import get from "lodash/get";
import find from "lodash/find";
import sortBy from "lodash/sortBy";
import { getSideIndex, SIDE_LEFT, SIDE_RIGHT } from '~/constants/encounter'

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db)

  const teamPlayers = await db.all(`
    SELECT
      tt.id,
      tp.id as playerId
      FROM tennisTeam tt
      left join tennisPlayer tp on tt.id = tp.teamId and tp.yearId = ${currentYear.id}
        WHERE tt.yearId = ${currentYear.id}
  `)

  let playerIdsByTeamId = groupBy(teamPlayers, 'id')
  playerIdsByTeamId = mapValues(playerIdsByTeamId, function (value) {
    return map(value, 'playerId')
  })

  const encounterFixtures = await db.all(`
    SELECT
      te.fixtureId,
               tf.teamIdLeft,
               tf.teamIdRight,
        te.playerIdLeft,
    te.playerIdRight
      FROM tennisEncounter te
      left join tennisFixture tf on te.fixtureId = tf.id and tf.yearId = ${currentYear.id}
        WHERE te.yearId = ${currentYear.id}
  `)

  if (!encounterFixtures) {
    return {
      players: []
    }
  }

  const encountersByFixture = groupBy(encounterFixtures, 'fixtureId')

  const playerIdsByFixtureId = mapValues(encountersByFixture, function (encounters) {
    const playerIdsLeft = map(encounters, 'playerIdLeft').filter(function (value) {
      return value !== null
    })
    const playerIdsRight = map(encounters, 'playerIdRight').filter(function (value) {
      return value !== null
    })
    return [
      uniq(playerIdsLeft),
      uniq(playerIdsRight)
    ]
  })

  const teamIdsByFixtureId = mapValues(encountersByFixture, function (value) {
    return [value[0].teamIdLeft, value[0].teamIdRight]
  })

  // Filter out all encounters, leaving only players who are not registered to that team.
  const playingUp = []
  const absentPlayerId = 0

  each(playerIdsByFixtureId, function (players, fixtureId) {
    [getSideIndex(SIDE_LEFT), getSideIndex(SIDE_RIGHT)].forEach(function (sideIndex) {
      const leftTeamId = teamIdsByFixtureId[fixtureId][sideIndex]
      const playerIdsPlayingUp = difference(
        players[sideIndex],
        playerIdsByTeamId[leftTeamId]
      )
      if (playerIdsPlayingUp.length > 0) {
        playerIdsPlayingUp.forEach(function (playerId) {
          if (playerId > absentPlayerId) {
            playingUp.push({
              fixtureId,
              playerId,
              teamId: leftTeamId
            })
          }
        })
      }
    })
  })

  const playerIds = uniqBy(playingUp, 'playerId').map(row => get(row, 'playerId'))
  const playerIdsQuery = playerIds.join(', ')

  const players = await db.all(`
    SELECT
      id,
      concat(nameFirst, ' ', nameLast) AS name,
      slug
      FROM tennisPlayer
        WHERE yearId = ${currentYear.id}
        and id in (${playerIdsQuery})
  `)

  const teamIds = uniqBy(playingUp, 'teamId')
    .map(row => get(row, 'teamId'))
  const teamIdsQuery = teamIds.join(', ')

  const teams = await db.all(`
    SELECT
      id,
      name,
      slug
      FROM tennisTeam
        WHERE yearId = ${currentYear.id}
        and id in (${teamIdsQuery})
  `)

  let playersPlayingUp = []

  playingUp.forEach(function (row) {
    const player = find(players, { id: row.playerId })
    const team = find(teams, { id: row.teamId })
    playersPlayingUp.push({
      fixtureId: row.fixtureId,
      player,
      team
    })
  })

  playersPlayingUp = sortBy(playersPlayingUp, ['player.name'])

  return {
    playingUps: playersPlayingUp,
    yearName: currentYear.name
  }
}


export default function AdminPlayersPlayingUpReport({ loaderData }: Route.ComponentProps) {
    const { playingUps, yearName } = loaderData;
  return (
          <>
      <h2 className='font-bold text-2xl mb-4 mt-6'>Players Playing Up</h2>
      <p>This report outlines all the players who have played within a different team this season.</p>
      <table className='my-6'>
        <thead>
          <tr>
            <td className='p-2 border border-stone-300'>Fixture ID</td>
            <td className='p-2 border border-stone-300'>Player Name</td>
            <td className='p-2 border border-stone-300'>Team Name</td>
          </tr>
        </thead>
        <tbody>
          {playingUps.map((playingUp, index) => (

            <tr className='my-2' key={index}>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} to={`/admin/fixture/${playingUp.fixtureId}`} rel='noreferrer'>{playingUp.fixtureId}</Link>
              </td>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} to={`/admin/player/${playingUp.player.id}`} rel='noreferrer'>{playingUp.player.name}</Link>
              </td>
              <td className='p-2 border border-stone-300'>
                <Link target='_blank' className={linkStyles.join(' ')} to={`/result/${yearName}/team/${playingUp.team.slug}`} rel='noreferrer'>{playingUp.team.name}</Link>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  );
}