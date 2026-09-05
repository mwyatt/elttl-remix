import type {Route} from "./+types/_front.result.$year.team.$slug";
import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import MainHeading from "~/components/MainHeading";
import {homeNightMap} from "~/constants/Team";
import WeeksTimeline from "~/components/WeeksTimeline";
import {buildMeta} from "~/constants/MetaData";
import {parseYearNameGetYear} from "~/libraries/year";
import {getKvFromContext} from "~/kv-context.server";
import Accordion from "~/components/Accordion";
import {getCoreTeamInformation} from "~/services/team.service.server";

export function meta({ params }: Route.MetaArgs) {
  const { year, slug } = params;

  // Convert slug to readable team name (e.g., "hyndburn-a" → "Hyndburn A")
  const teamName = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return buildMeta({
    title: `${teamName} – ${year} Team Overview & Results`,
    description: `View the full team overview for ${teamName} in the ${year} season, including division details, venue, home night, registered players, weekly fixtures, and fulfilled match results.`,
  });
}


export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, slug } = params
  const currentYear = await parseYearNameGetYear(db, year)

  const data = await getCoreTeamInformation(kv, db, currentYear.id, slug)

  return Response.json(data, { status: StatusCodes.OK })
}

export default function _frontResultYearTeamSlug({ loaderData, params }: Route.ComponentProps) {
    const {
team, players, fixtures, weeks
  } = loaderData;
  const { year } = params

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: team.name }
          ]
        }
      />

      <MainHeading name={team.name} />

      <div className='md:flex gap-8'>
        <div className='flex-1'>

          <SubHeading name='General Information' />
          <p className='my-2'>Team in the <Link className={linkStyles.join(' ')} to={`/result/${year}/${team.divisionSlug}`}>{team.divisionName}</Link> division playing at the <Link className={linkStyles.join(' ')} to={`/result/${year}/venue/${team.venueSlug}`}>{team.venueName}</Link> venue on a <strong>{homeNightMap[team.homeWeekday]}</strong> night.</p>

          {team.secretaryName && (
            <p>Secretary is <Link className={linkStyles.join(' ')} to={`/result/${year}/player/${team.secretarySlug}`}>{team.secretaryName}</Link></p>
          )}
          {!team.secretaryName && (
            <p>There is no team secretary currently.</p>
          )}

          {weeks.length > 0 && (
              <Accordion previewHeight={400}>
            <WeeksTimeline yearName={year} weeks={weeks} teamSlug={team.slug} />
              </Accordion>
          )}

        </div>
        <div className='flex-1'>
          <SubHeading name='Registered Players' />
          <div className=''>

            {players.map((player, index) => (
              <div key={index} className='flex p-4 gap-4 border-t border-t-neutral-300 border-dashed hover:bg-gray-100'>
                <div className='flex-2'>
                  <Link
                    to={`/result/${year}/player/${player.slug}`}
                    className={linkStyles.join(' ')}
                    key={player.slug}
                  >
                    {player.name}
                  </Link>
                </div>
                <div className='flex-1 text-right'>
                  <span className='float-right text-tertiary-500'>{player.rank}</span>
                </div>
              </div>
            ))}

          </div>

          {/* <SubHeading name='Directions' /> */}
          {/* <DirectionsButton url={data.venue.location} /> */}

          <SubHeading name='Fixtures Fulfilled' />
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3 '>

            {fixtures.map((fixture, index) => (
              <FixtureCard
                key={index}
                year={year}
                teamLeft={{ name: fixture.teamLeftName, slug: fixture.teamLeftSlug, score: fixture.scoreLeft }}
                teamRight={{ name: fixture.teamRightName, slug: fixture.teamRightSlug, score: fixture.scoreRight }}
                timeFulfilled={fixture.timeFulfilled}
              />
            ))}

          </div>

        </div>
      </div>

    </>
  )
}