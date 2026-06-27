import classNames from 'classnames'
import {Link} from "react-router";
import {getClosestWeekId} from "~/libraries/date";
import Week from "~/components/Week";

export default function WeeksTimeline ({ yearName, weeks, teamSlug }) {
  const closestWeekId = getClosestWeekId(weeks)

  return (
    <>
      <div className='flex mt-6 mb-4 items-center gap-4'>
        <div className='flex-grow'>
          <h2 className='text-2xl'>Events</h2>
        </div>
        <div>
          <Link
            className='color-secondary-500 border-b border-secondary-500 whitespace-nowrap'
            to={`/result/${yearName}/season`}
          >Season Overview
          </Link>
        </div>
      </div>
      <div className={classNames({
        'grid gap-y-0': true
      })}
      >
        {weeks.map((week) => <Week key={week.id} yearName={yearName} week={week} teamSlug={teamSlug} closestWeekId={closestWeekId} />)}
      </div>
    </>
  )
}
