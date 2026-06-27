import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {getYearDivisionId} from "~/repositories/year.repository.server";
import {Link, useSearchParams} from "react-router";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import SubHeading from "~/components/SubHeading";
import InformationTable from "~/components/team/InformationTable";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import {getOtherSideCapitalized, getSidesCapitalized} from "~/constants/encounter";
import {getEncounterMerit} from "~/libraries/encounter.lib";
import { uniq } from 'lodash'
import {getShortPlayerName} from "~/libraries/player";
import {getYearDivisionMeritEncounters} from "~/repositories/encounter.repository.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "@todo" },
  ];
}

export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year, division } = params
  const yearDivisionId = await getYearDivisionId(db, year, division)

  // @todo make DRY
  if (!yearDivisionId) {
    return Response.json(`Unable to find division with year name '${year}' and slug '${division}'`, { status: StatusCodes.NOT_FOUND })
  }

  const encounters = await getYearDivisionMeritEncounters(db, yearDivisionId.yearId, yearDivisionId.divisionId)

  let stats = getEncounterMerit(encounters)
  const playerIds = stats.map(s => s.player.id)
  const uniquePlayerIds = uniq(playerIds)

  const teamDivisions = await db.all(sql`
    select
        tp.id,
        tt.divisionId,
        tt.id as teamId,
        tt.name as teamName,
        tt.slug as teamSlug
    from tennisPlayer tp
    left join tennisTeam tt on tt.id = tp.teamId and tt.yearId = tp.yearId
    where tp.yearId = ${yearDivisionId.yearId}
    and tp.id IN (${sql.join(uniquePlayerIds, sql`, `)})
  `)

  // Get all player ids which are not in the current division and remove them from stats
  const playerIdsNotInDivision = teamDivisions.filter(td => td.divisionId !== yearDivisionId.divisionId).map(td => td.id)

  stats = stats.filter(s => !playerIdsNotInDivision.includes(s.player.id))

  // Modify stats teams so that the team that the player is registered to is shown
  // It was possible for a player playing up to then have their team showing the last team they played for
  stats = stats.map(stat => {
    const playerTeamDivision = teamDivisions.find(teamDivision => teamDivision.id === stat.player.id)
    if (playerTeamDivision) {
      return {
        ...stat,
        team: {
          ...stat.team,
          name: playerTeamDivision.teamName,
          slug: playerTeamDivision.teamSlug
        }
      }
    }
    return stat
  })

  return Response.json({
    stats
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearDivisionMerit({ loaderData, params }: Route.ComponentProps) {
    const {
    stats
  } = loaderData;
  const { year, division } = params

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division), href: `/result/${year}/${division}` },
            { name: 'Merit Table', href: `/result/${year}/${division}/merit` }
          ]
        }
      />
      <h2 className='text-3xl mb-4 sm:text-4xl sm:mb-8'>
        <span className='capitalize'>{division}</span> Division Merit Table
      </h2>
      <p>This is the merit table for the <span className='capitalize'>{division}</span> division.</p>
      <DivisionalSubMenu year={year} division={division} />
      <table className='table-auto w-full mt-4'>
        <thead>
          <tr>
            <th className='p-2 md:p-4'>Name</th>
            <th className='p-2 md:p-4 hidden sm:block'>Team</th>
            <th className='p-2 md:p-4'>R<span className='hidden sm:inline'>a</span>nk</th>
            <th className='p-2 md:p-4'>W<span className='hidden sm:inline'>on</span></th>
            <th className='p-2 md:p-4'>Pl<span className='hidden sm:inline'>aye</span>d</th>
            <th className='p-2 md:p-4'>Av<span className='hidden sm:inline'>era</span>g<span className='hidden sm:inline'>e</span></th>
            <th className='p-2 md:p-4'>Enc<span className='hidden sm:inline'>ounters</span></th>
          </tr>
        </thead>
        <tbody>

          {stats.map((stat, index) => (
            <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
              <td className='p-2 md:p-4'>
                <Link className={linkStyles.join(' ')} to={`/result/${year}/player/${stat.player.slug}`}>
                  <span className='sm:hidden'>{getShortPlayerName(stat.player.name)}</span>
                  <span className='hidden sm:inline'>{stat.player.name}</span>
                </Link>
              </td>
              <td className='p-2 hidden sm:block md:p-4'>
                <Link className={`${linkStyles.join(' ')} text-tertiary-500 border-b-tertiary-500`} to={`/result/${year}/team/${stat.team.slug}`}>{stat.team.name}</Link>
              </td>
              <td className='p-2 md:p-4 text-center'>{stat.player.rank}</td>
              <td className='p-2 md:p-4 text-center'>{stat.won}</td>
              <td className='p-2 md:p-4 text-center'>{stat.played}</td>
              <td className='p-2 md:p-4 text-center'>{Math.round(stat.average * 100)}</td>
              <td className='p-2 md:p-4 text-center'>{stat.encounter}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </>
  )
}