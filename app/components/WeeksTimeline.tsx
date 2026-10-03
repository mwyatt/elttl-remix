import classNames from 'classnames'
import {Link} from "react-router";
import {getClosestWeekId} from "~/libraries/date";
import Week from "~/components/Week";
import {getSeasonName} from "~/libraries/year";
import LinkButton from "~/components/LinkButton";

export default function WeeksTimeline ({ yearName, weeks, teamSlug }) {
  const closestWeekId = getClosestWeekId(weeks)

  return (
    <>
      <div className='flex flex-col sm:flex-row mt-6 mb-4 items-center gap-4'>
        <div className='flex-grow'>
          <h2 className='text-2xl'>{getSeasonName(yearName)} Season</h2>
        </div>
        <div>
          <LinkButton
            to={`/result/${yearName}/season`}
            theme={'secondary'}
          >
            Season Overview
          </LinkButton>
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
