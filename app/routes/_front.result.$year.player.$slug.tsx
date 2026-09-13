import type {Route} from "./+types/_front.result.$year.player.$slug";
import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {Link} from "react-router";
import SubHeading from "~/components/SubHeading";
import MainHeading from "~/components/MainHeading";
import {getShortPlayerName} from "~/libraries/player";
import {linkStyles} from "~/styles/ui-classes";
import WeeksTimeline from "~/components/WeeksTimeline";
import RankChange from "~/components/player/RankChange";
import FixtureCard from "~/components/FixtureCard";
import {buildMeta} from "~/constants/MetaData";
import {parseYearNameGetYear} from "~/libraries/year";
import {getKvFromContext} from "~/kv-context.server";
import Accordion from "~/components/Accordion";
import {getCorePlayerInformation} from "~/services/player.service.server";

export function meta({ params }: Route.MetaArgs) {
  const { year, slug } = params;

  // Convert slug to a readable name (e.g., "john-smith" → "John Smith")
  const playerName = slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return buildMeta({
    title: `${playerName} – ${year} Player Performance & Results`,
    description: `View detailed performance results for ${playerName} in the ${year} season, including encounters, scores, rank changes, team information, weekly fixtures, and fulfilled matches.`,
  });
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const kv = getKvFromContext(context)
  const { year, slug } = params
  const currentYear = await parseYearNameGetYear(db, year)

    const data = await getCorePlayerInformation(kv, db, currentYear.id, slug)

  return Response.json(data, { status: StatusCodes.OK })
}

export default function _frontResultYearPlayerSlug({ loaderData, params }: Route.ComponentProps<typeof loader>) {
    const {
player, encounters, fixtures, weeks
  } = loaderData;
  const { year, slug } = params

  const getPlayerLink = (playerSlug, playerName) => {
    if (playerSlug === slug) {
      return (
        <>
          <span className='sm:hidden text-tertiary-500'>{getShortPlayerName(playerName)}</span>
          <span className='hidden sm:inline text-tertiary-500'>{playerName}</span>
        </>
      )
    }
    return (
      <Link className={linkStyles.join(' ')} to={`/result/${year}/player/${playerSlug}`}>
        <span className='sm:hidden'>{getShortPlayerName(playerName)}</span>
        <span className='hidden sm:inline'>{playerName}</span>
      </Link>
    )
  }

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Results', href: '/result' },
            { name: year, href: `/result/${year}` },
            { name: player.name }
          ]
        }
      />

      <MainHeading name={player.name} />
      <div className='lg:grid lg:grid-cols-8 gap-16'>
        <div className='lg:col-span-5'>
          <SubHeading name='General Information' />
          <p>
            {'Plays for the '}
            <Link
              className={linkStyles.join(' ')}
              to={`/result/${year}/team/${player.teamSlug}`}
            >
              {player.teamName}
            </Link>
            {' team with a rank of '}
            <span className='font-bold'>{player.rank}</span>
            {' and has had '}
            <span className='font-bold'>{encounters.length}</span>
            {' encounters with other players so far this season.'}
          </p>

          {(player.phoneLandline || player.phoneMobile) && (
            <>
              <SubHeading name='Contact Information' />
              {player.phoneLandline && (
                <p className='mb-2'>
                  {'Phone Landline: '}
                  <a
                    className='text-primary-500'
                    to={`tel:${player.phoneLandline}`}
                  >
                    {player.phoneLandline}
                  </a>
                </p>
              )}
              {player.phoneMobile && (
                <p className='mb-2'>
                  {'Phone Mobile: '}
                  <a
                    className='text-primary-500'
                    to={`tel:${player.phoneMobile}`}
                  >
                    {player.phoneMobile}
                  </a>
                </p>
              )}
            </>
          )}

          {weeks.length > 0 && (
              <Accordion previewHeight={400}>
                <WeeksTimeline yearName={year} weeks={weeks} teamSlug={player.teamSlug} />
              </Accordion>
          )}
        </div>

        <div className='lg:col-span-3'>

          <SubHeading name='Performance' />

              <Accordion previewHeight={400}>
          <div className='grid grid-cols-10'>

            {encounters.map((encounter, index) => (
              <div key={index} className='contents'>
                <div className='col-span-4 pt-3 border-t border-dashed border-t-stone-300 pb-3'>
                  {getPlayerLink(encounter.playerLeftSlug, encounter.playerLeftName)}
                  <RankChange rankChange={encounter.playerRankChangeLeft} />
                </div>
                <div
                  className=' text-right pt-3 border-t border-dashed border-t-stone-300 pb-3 pr-2'
                >{encounter.scoreLeft}
                </div>
                <div className=' pt-3 border-t border-dashed border-t-stone-300 pb-3 pl-2'>{encounter.scoreRight}</div>
                <div className='col-span-4  pt-3 border-t border-dashed border-t-stone-300 pb-3 text-right'>
                  <RankChange rankChange={encounter.playerRankChangeRight} />
                  {getPlayerLink(encounter.playerRightSlug, encounter.playerRightName)}
                </div>
              </div>
            ))}
          </div>
              </Accordion>

        </div>

      </div>

      {/* @todo make this only fixtures that the player has been involved in */}
      <SubHeading name='Team Fixtures' />
      <div className='grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 '>

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

    </>
  )
}