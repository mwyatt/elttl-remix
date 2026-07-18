import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {sql} from "drizzle-orm";
import {Link} from "react-router";
import {capitalizeFirstLetter} from "~/libraries/misc";
import DivisionalSubMenu from "~/components/DivisionalSubMenu";
import SubHeading from "~/components/SubHeading";
import InformationTable from "~/components/team/InformationTable";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import {buildMeta} from "~/constants/MetaData";
import {parseYearDivisionId} from "~/libraries/year";
import {getDivisionLeagueTable, getTeamsFulfilledFixtures} from "~/repositories/encounter.repository.server";
import {getKvFromContext} from "~/kv-context.server";
import {getUnfulfilledFixturesByTeamIds} from "~/repositories/fixture.repository.server";

export function meta({ params }: Route.MetaArgs) {
  const { year, division } = params;
  const divisionName = capitalizeFirstLetter(division);

  return buildMeta({
    title: `${divisionName} Division Overview – ${year}`,
    description: `Explore the ${divisionName} division overview for the ${year} season, including team details, venues, secretaries, head‑to‑head results, fulfilled fixtures, and upcoming matches across the division.`,
  });
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, division } = params
  const yearDivisionId = await parseYearDivisionId(db, year, division)

  const teams = await db.all(sql`
      SELECT tt.id,
             tt.name,
             tt.slug,
             tv.name                                   venueName,
             tv.slug                                   venueSlug,
             tp.slug                                   secretarySlug,
             concat(tp.nameFirst, ' ', tp.nameLast) AS secretaryName,
             tp.phoneLandline                          secretaryPhoneLandline,
             tp.phoneMobile                            secretaryPhoneMobile
      FROM tennisTeam tt
               LEFT JOIN tennisVenue tv ON tt.venueId = tv.id AND tv.yearId = tt.yearId
               LEFT JOIN tennisPlayer tp ON tt.secretaryId = tp.id AND tp.yearId = tt.yearId
      WHERE tt.yearId = ${yearDivisionId.yearId}
        AND tt.divisionId = ${yearDivisionId.divisionId}
  `)

  const leagueTable = await getDivisionLeagueTable(kv, db, yearDivisionId.yearId, yearDivisionId.divisionId)

  const teamIds = teams.map(team => team.id)

  const fulfilledFixtures = await getTeamsFulfilledFixtures(kv, db, yearDivisionId.yearId, teamIds)

  const unfulfillfedFixtures = await getUnfulfilledFixturesByTeamIds(kv, db, yearDivisionId.yearId, teamIds)

  return Response.json({
    leagueTable,
    teams,
    fulfilledFixtures,
    unfulfillfedFixtures
  }, { status: StatusCodes.OK })
}

export default function _frontResultYearDivision({ loaderData, params }: Route.ComponentProps) {
    const {
    leagueTable,
    teams,
    fulfilledFixtures,
    unfulfillfedFixtures
  } = loaderData;
  const { year, division } = params

  const getLeagueTableRow = (teamLeftSlug, teamRightSlug) => {
    for (const row of leagueTable) {
      if (row.teamLeftSlug === teamLeftSlug && row.teamRightSlug === teamRightSlug) {
        return row
      }
    }
  }

  return (
      <>
      <Breadcrumbs items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: capitalizeFirstLetter(division) }
          ]
        }
      />
      <h2 className='text-4xl mb-8'>
        <span className='capitalize'>{division}</span> Division
      </h2>
      <p>This is an overview for the {division} division.</p>
      <DivisionalSubMenu year={year} division={division} />

      <SubHeading name='Teams' />
      <InformationTable yearName={year} teams={teams} />

      <SubHeading name='Overview' />
      <div className='lg:hidden mb-4'>
        <p>Please visit this page using a larger screen to view the divisional overview.</p>
      </div>
      <table className='w-full hidden lg:table'>
        <thead>
          <tr>
            <th className='border border-stone-400 p-2' />

            {teams.map((team, index) => (
              <th className='border border-stone-400 p-2' key={index}>
                <Link className={linkStyles.join(' ') + 'border-b-tertiary-500 text-tertiary-500'} to={`/result/${year}/team/${team.slug}`}>{team.name}</Link>
              </th>
            ))}

          </tr>
        </thead>
        <tbody>

          {teams.map((teamLeft, index) => (
            <tr key={index}>
              <td className='border border-stone-400 p-2'>
                <Link className={linkStyles.join(' ')} to={`/result/${year}/team/${teamLeft.slug}`}>{teamLeft.name}</Link>
              </td>
              {teams.map((teamRight, trIndex) => {
                const leagueTableRow = getLeagueTableRow(teamLeft.slug, teamRight.slug)
                let scoresContent = ''
                if (leagueTableRow) {
                  scoresContent = <Link className={linkStyles.join(' ')} to={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}>{leagueTableRow.scoreLeft} - {leagueTableRow.scoreRight}</Link>
                }
                return (
                  <td key={trIndex} className='border border-stone-400 p-2 text-center'>
                    {scoresContent}
                  </td>
                )
              })}
            </tr>
          ))}

        </tbody>
      </table>

      <SubHeading name='Fixtures' />
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>

        {fulfilledFixtures.map((fixture, index) => (
          <FixtureCard
            key={index}
            year={year}
            teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
            teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
            timeFulfilled={fixture.timeFulfilled}
          />
        ))}

        {unfulfillfedFixtures.map((fixture, index) => (
          <FixtureCard
            key={index}
            year={year}
            teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
            teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
            timeFulfilled={fixture.timeFulfilled}
          />
        ))}

      </div>
          </>
  )
}