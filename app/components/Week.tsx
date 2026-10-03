import classNames from 'classnames'
import { BiTrophy } from 'react-icons/bi'
import {Link} from "react-router";
import {ExactDayWeekTypes, NonEventTypes, WeekTypeLabels, WeekTypes} from "~/constants/Week";
import {formatDateWithDayAndSuffixOfMonth, formatDayWithSuffixOfMonth, getFixtureDayFormatted} from "~/libraries/date";
import {getWeekDate} from "~/libraries/week";
import {linkStyles} from "~/styles/ui-classes";
import FixtureCard from "~/components/FixtureCard";
import {getContextualScoreStatus} from "~/libraries/fixture.lib";
import DirectionsButton from "~/components/DirectionsButton";
import LinkButton from "~/components/LinkButton";

function FixtureDescription ({ yearName, currentTeamSlug, fixture, isAtHome }) {
  let parts = []

  if (fixture.timeFulfilled) {
    parts.push(getContextualScoreStatus(currentTeamSlug === fixture.teamLeftSlug, fixture.scoreLeft, fixture.scoreRight))
    parts.push(' at ')
  }

  parts.push(isAtHome ? 'home' : 'away')
  parts.push(' vs ')

  // @todo Refactor
  if (isAtHome) {
    parts.push(
      <Link
        className={linkStyles.join(' ')}
        to={`/result/${yearName}/team/${fixture.teamRightSlug}`}
        key={1}
      >
        {fixture.teamRightName}
      </Link>
    )
  } else {
    parts.push(
            <Link
        className={linkStyles.join(' ')}
        to={`/result/${yearName}/team/${fixture.teamLeftSlug}`}
        key={2}
      >{fixture.teamLeftName}
      </Link>
    )
  }

  parts.push(' at ')
  parts.push(
    <Link
                className={linkStyles.join(' ')}
                to={`/result/${yearName}/venue/${fixture.venueSlug}`}
                key={3}
              >{fixture.venueName}
              </Link>
  )

  // Capitalise first parts entry
  parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)

  return (
    <span>
      {parts}
    </span>
  )
}

export default function Week ({ yearName, week, teamSlug, closestWeekId }) {
  const isCurrentWeek = week.id === closestWeekId
  const isFixtureWeek = week.type === WeekTypes.fixture && week.fixtures.length > 0
  const isEvent = NonEventTypes.includes(week.type) === false
  const isAtHome = week.fixtures.some(fixture => fixture.teamLeftSlug === teamSlug)
  const isExactDayWeekType = ExactDayWeekTypes.includes(week.type)
  const isExactEventDate = isExactDayWeekType || isFixtureWeek
  let fixtureLink = ''
  let fixture = null
  let formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(week.type, week.timeStart)
  )
  if (isFixtureWeek) {
    fixture = week.fixtures[0]
    fixtureLink = `/result/${yearName}/fixture/${fixture.teamLeftSlug}/${fixture.teamRightSlug}`
    formattedDate = getFixtureDayFormatted(week.timeStart, fixture.homeWeekday);
  }

  if (isExactDayWeekType) {
    formattedDate = formatDateWithDayAndSuffixOfMonth(
      getWeekDate(week.type, week.timeStart)
    )
  }

  return (
    <div id={isCurrentWeek ? 'timeline-current-week' : undefined} className={classNames({
      'sm:grid grid-cols-6 border-stone-300': week.type !== WeekTypes.nothing,
      'border-b-primary-500': isCurrentWeek,
      hidden: week.type === WeekTypes.nothing
    })}
    >
      <div className={classNames({
        'col-span-2 border-stone-200 flex items-center sm:justify-end pb-2 sm:p-2 sm:pr-4 sm:text-right text-lg': true,
        'border-r-primary-500': isEvent,
        'border-r-primary-500 font-bold p-2 pl-4': isCurrentWeek
      })}
      >
        <Link
          to={`/result/${yearName}/week/${week.id}`}
        >{!isExactEventDate && (
          <span
            className={classNames({
              'border-b border-dashed': true,
              'border-stone-400 text-stone-400': !isCurrentWeek,
              'text-emerald-200 border-emerald-200': isCurrentWeek
            })} title='Week Commencing'
          >w/c
          </span>
        )} {formattedDate}
        </Link>
      </div>
      <div className={classNames({
        "col-span-4 flex flex-col pl-4 pt-4 pb-8 sm:p-4 pr-0 gap-4 sm:gap-6 border-l-2 border-b-2 border-stone-100 mb-6": true,
        'border-l-primary-500': isEvent || isCurrentWeek,
        'border-b-primary-500': isCurrentWeek,
      })}>
        <div className='text-lg flex-grow'>
          {isEvent && (
            <BiTrophy className='inline mr-4 mb-1 fill-primary-500' size={28} />
          )}
          {!isFixtureWeek && (
            <span className='text-xl font-semibold'>{WeekTypeLabels[week.type]}</span>
          )}
          {(isFixtureWeek && fixture !== null) && (
            <div>
              <FixtureDescription
                yearName={yearName}
                currentTeamSlug={teamSlug}
                fixture={fixture}
                isAtHome={isAtHome}
              />
            </div>
          )}
        </div>
        <div className='sm:p-2 pr-0 flex items-end justify-end'>
          {/* <Link */}
          {/*  className={allHomeButtonStyles} */}
          {/*  to={`/result/${yearName}/week/${week.id}`} */}
          {/* >View Week */}
          {/* </Link> */}

          {(isFixtureWeek && !fixture.timeFulfilled && !isAtHome) && (
            <DirectionsButton url={fixture.venueLocation} />
          )}
          {(isFixtureWeek && fixture.timeFulfilled) && (
            <FixtureCard
              timeFulfilled={fixture.timeFulfilled}
              year={yearName}
              teamLeft={{
                slug: fixture.teamLeftSlug,
                name: fixture.teamLeftName,
                score: fixture.scoreLeft,
              }}
              teamRight={{
                slug: fixture.teamRightSlug,
                name: fixture.teamRightName,
                score: fixture.scoreRight,
              }}
            />
          )}
          {(isEvent || week.type === WeekTypes.catchup) && (
            <LinkButton
              to={`/result/${yearName}/week/${week.id}`}
              theme={'secondary'}
            >More Info
            </LinkButton>
          )}
        </div>
      </div>
    </div>
  )
}
