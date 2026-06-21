import { allHomeButtonStyles } from '~/styles/ui-classes'
import {Link} from "react-router";

export default function ThisWeek ({ yearName, week, fixtures = [] }) {
  const description = (fixtures.length > 0 ? `${fixtures.length} fixture${fixtures.length > 1 ? 's' : ''} are` : 'There are no fixtures') + ' scheduled to be played this week'
  return (
    <div className='grow flex flex-col gap-4 h-full'>
      <div className='flex w-full justify-end'>
        <h2 className='text-2xl grow'>This Week</h2>
        <Link className={allHomeButtonStyles} to={`/result/${yearName}/season`}>Season Overview</Link>
      </div>
      <div className='grow flex items-center text-center'>
        <p className='mt-2 text-2xl'>{description}</p>
      </div>
      {week && (

        <div className='flex justify-end'>
          <Link to={`/result/${yearName}/week/${week.id}`} className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg'>View Week</Link>
        </div>
      )}
    </div>
  )
}
