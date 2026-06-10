'use client'

import GeneralLink from '@/components/GeneralLink'
import { ExactDayWeekTypes, WeekTypeLabels } from '@/constants/Week'
import { formatDayWithSuffixOfMonth } from '@/lib/date'
import { getWeekDate } from '@/lib/week'
import { GiTrophyCup } from 'react-icons/gi'

export default function UpcomingEventWeek ({ yearName, week }) {
  const isExactEventDate = ExactDayWeekTypes.includes(week.type)
  const formattedDate = formatDayWithSuffixOfMonth(
    getWeekDate(week.type, week.timeStart)
  )

  return (
    <div className='flex flex-col items-center justify-center gap-6 h-full'>
      <div className='grow flex gap-4'>
        <div>
          <GiTrophyCup className='inline mr-1 mb-1 fill-primary-500' size={120} />
        </div>
        <div>
          <h1 className='text-3xl font-bold mb-4'>{WeekTypeLabels[week.type]}</h1>
          <p className='text-xl grow'>
            {isExactEventDate === false && (
              <>
                <span className='border-b border-dashed border-stone-400 text-stone-400' title='Week Commencing'>w/c</span>
                {' '}
              </>
            )}
            {formattedDate}
          </p>
        </div>
      </div>
      <div className='w-full flex gap-4 justify-end'>
        <GeneralLink className='text-stone-500 border border-stone-400 px-2 py-1 rounded text-lg flex items-center' href={`/result/${yearName}/season`}>Season Overview</GeneralLink>
        <GeneralLink href={`/result/${yearName}/week/${week.id}`} className='bg-primary-500 rounded px-3 py-2 text-white font-bold capitalize transition-colors text-lg'>More Info</GeneralLink>
      </div>
    </div>
  )
}
