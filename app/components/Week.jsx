import {
  formatDateWithDayAndSuffixOfMonth,
  formatDayWithSuffixOfMonth
} from '@/lib/date'
import { getWeekDate } from '@/lib/week'
import { ExactDayWeekTypes, NonEventTypes, WeekTypeLabels, WeekTypes } from '@/constants/Week'
import classNames from 'classnames'
import { BiMap, BiTrophy } from 'react-icons/bi'
import GeneralLink from '@/components/GeneralLink'
import { allHomeButtonStyles, linkStyles } from '@/lib/styles'
import dayjs from 'dayjs'

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
    formattedDate = formatDateWithDayAndSuffixOfMonth(
      dayjs.unix(week.timeStart).add(fixture.homeWeekday, 'day')
    )
  }

  if (isExactDayWeekType) {
    formattedDate = formatDateWithDayAndSuffixOfMonth(
      getWeekDate(week.type, week.timeStart)
    )
  }

  return (
    <div className={classNames({
      'grid grid-cols-6 border-b border-stone-300': true,
      'border-b-primary-500 border-solid border-b-2': isCurrentWeek,
      'border-dashed': !isCurrentWeek,
      hidden: week.type === WeekTypes.nothing
    })}
    >
      <div className={classNames({
        'col-span-2 border-r border-r-2 border-stone-200 flex items-center justify-end p-2 pr-4 text-right': true,
        'border-r-primary-500': isEvent,
        'border-r-primary-500 bg-primary-500 text-white': isCurrentWeek
      })}
      >
        <GeneralLink
          href={`/result/${yearName}/week/${week.id}`}
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
        </GeneralLink>
      </div>
      <div className='col-span-4 flex flex-col sm:flex-row p-2 pr-0 gap-2 sm:gap-4 sm:items-center'>
        <div className='text-lg flex-grow'>
          {isEvent && (
            <BiTrophy className='inline mr-1 mb-1 fill-primary-500' size={24} />
          )}
          {!isFixtureWeek && WeekTypeLabels[week.type]}
          {(isFixtureWeek && fixture !== null) && (
            <div>
              {isAtHome && ('Home')}
              {!isAtHome && ('Away')}
              {' vs '}
              {isAtHome && (
                <GeneralLink
                  className={linkStyles.join(' ')}
                  href={`/result/${yearName}/team/${fixture.teamRightSlug}`}
                >
                  {fixture.teamRightName}
                </GeneralLink>
              )}
              {!isAtHome && (
                <GeneralLink
                  className={linkStyles.join(' ')}
                  href={`/result/${yearName}/team/${fixture.teamLeftSlug}`}
                >{fixture.teamLeftName}
                </GeneralLink>
              )}
              {' at '}
              <GeneralLink
                className={linkStyles.join(' ')}
                href={`/result/${yearName}/venue/${fixture.venueSlug}`}
              >{fixture.venueName}
              </GeneralLink>
            </div>
          )}
        </div>
        <div className='sm:p-2 pr-0 flex items-end justify-end'>
          {/* <GeneralLink */}
          {/*  className={allHomeButtonStyles} */}
          {/*  href={`/result/${yearName}/week/${week.id}`} */}
          {/* >View Week */}
          {/* </GeneralLink> */}

          {(isFixtureWeek && !fixture.timeFulfilled && !isAtHome) && (
            <GeneralLink href={fixture.venueLocation} target='_blank' rel='noreferrer' className={`${allHomeButtonStyles.join(' ')} flex items-center gap-1 inline-block`}>
              <span><BiMap size={20} /></span>
              <span>Directions</span>
            </GeneralLink>
          )}
          {(isFixtureWeek && fixture.timeFulfilled) && (
            <GeneralLink
              className={`${allHomeButtonStyles} whitespace-nowrap inline-block`}
              href={fixtureLink}
            >View {fixture.timeFulfilled ? 'Result' : 'Fixture'}
            </GeneralLink>
          )}
          {(isEvent || week.type === WeekTypes.catchup) && (
            <GeneralLink
              className='color-secondary-500 border-b border-secondary-500 whitespace-nowrap inline-block'
              href={`/result/${yearName}/week/${week.id}`}
            >More Info
            </GeneralLink>
          )}
        </div>
      </div>
    </div>
  )
}
