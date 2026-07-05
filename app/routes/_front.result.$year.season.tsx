import {getDbFromContext} from "~/db-context.server";
import {StatusCodes} from "http-status-codes";
import Breadcrumbs from "~/components/Breadcrumbs";
import {Link} from "react-router";
import {linkStyles} from "~/styles/ui-classes";
import {getAllWeeksByYear} from "~/repositories/week.repository.server";
import MainHeading from "~/components/MainHeading";
import {formatDayWithSuffixOfMonth, isCurrentWeek} from "~/libraries/date";
import {getWeekDate} from "~/libraries/week";
import {ExactDayWeekTypes, NonEventTypes, WeekTypeLabels, WeekTypes} from "~/constants/Week";
import classNames from "classnames";
import {BiTrophy} from "react-icons/bi";
import {buildMeta} from "~/constants/MetaData";
import {parseYearNameGetYear} from "~/libraries/year";

export function meta({ params }: Route.MetaArgs) {
  const { year } = params;

  return buildMeta({
    title: `Season Overview – ${year}`,
    description: `Explore the full week‑by‑week schedule for the ${year} season, including fixture weeks, event weeks, dates, and links to detailed results for each part of the East Lancashire Table Tennis League season.`,
  });
}


export async function loader({ request, context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context)
  const { year } = params
  const requestedYear = await parseYearNameGetYear(db, year)

  const weeks = await getAllWeeksByYear(db, requestedYear.id)

  return Response.json({
    weeks
  }, { status: StatusCodes.OK })
}

const Week = ({ yearName, week }) => {
  const currentWeek = isCurrentWeek(week.timeStart)
  const formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(week.type, week.timeStart)
  )
  const isEvent = NonEventTypes.includes(week.type) === false
  const isExactEventDate = ExactDayWeekTypes.includes(week.type)

  return (
    <div className={classNames({
      'border rounded': true,
      'border-primary-500': currentWeek,
      'overflow-hidden': true,
      'flex flex-col': true,
      'border-2': isEvent || currentWeek,
      'border-b-primary-500': isEvent,
      hidden: week.type === WeekTypes.nothing
    })}
    >
      <p className='p-2 text-center bg-stone-100'>
        {isExactEventDate === false && (
          <>
            <span className='border-b border-dashed border-stone-400 text-stone-400' title='Week Commencing'>w/c</span>
            {' '}
          </>
        )}
        {formattedDate}
      </p>
      <div className='p-4 flex flex-col gap-4 flex-grow'>
        <h2 className='text-2xl flex-grow'>
          {isEvent && (
            <BiTrophy className='inline mr-1 mb-1 fill-primary-500' size={24} />
          )}
          {WeekTypeLabels[week.type]}
        </h2>
        <div className='flex justify-end'>
          {week.type !== WeekTypes.nothing && (
            <Link
              className={linkStyles.join(' ')}
              to={`/result/${yearName}/week/${week.id}`}
            >View
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function _frontResultYearSeason({ loaderData, params }: Route.ComponentProps) {
    const {
    weeks
  } = loaderData;
  const { year } = params

  return (
    <>
      <Breadcrumbs
        items={
          [
            { name: 'Season' }
          ]
        }
      />

      <MainHeading name='Season Overview' />
      <p className='mb-12'>This is an overview of what is happening each week in the {year} season:</p>

      {weeks.length === 0 && (
        <p>No weeks have been configured yet.</p>
      )}
      {weeks.length > 0 && (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>

          {weeks.map((week) => <Week key={week.id} yearName={year} week={week} />)}

        </div>
      )}
    </>
  )
}