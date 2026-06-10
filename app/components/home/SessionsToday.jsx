'use client'

import GeneralLink from '@/components/GeneralLink'
import dayjs from 'dayjs'
import { homeNightMap } from '@/constants/Team'
import { getDayVenueSessions, sessionContacts, sessionVenues } from '@/constants/VenueSessions'
import { allHomeButtonStyles, linkStyles } from '@/lib/styles'

export default function SessionsToday ({ yearName }) {
  let date = dayjs()
  let sessions = getDayVenueSessions(date)

  // Could be Sunday so we need to check the next day.
  if (Object.entries(sessions).length === 0) {
    date = date.add(1, 'day')
    sessions = getDayVenueSessions(date)
  }

  return (
    <div className='px-4 md:px-0'>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>{homeNightMap[date.day()]} Sessions</h2>
        <GeneralLink className={allHomeButtonStyles} href='/sessions'>All Sessions</GeneralLink>
      </div>
      <div className='flex flex-wrap gap-3'>

        {Object.entries(sessions).map(([venueId, sessions]) => (
          <div key={venueId} className='mb-4'>
            <h3 className='text-lg mb-4'>
              <GeneralLink href={`/result/${yearName}/venue/${sessionVenues[venueId].slug}`} className={linkStyles.join(' ')}>
                {sessionVenues[venueId].name}
              </GeneralLink>
            </h3>
            <ul className='list-disc list-inside pl-5'>
              {sessions.map((session, index) => (
                <li key={index}>
                  {session.name}
                  {session.cost && (
                    <span className='px-2 rounded bg-primary-500 text-white text-sm ml-2'>{session.cost}</span>
                  )}
                  {session.contactId && (
                    <span className='ml-2 text-sm text-gray-500 text-base'>Contact: <GeneralLink className={linkStyles.join(' ')} href={`result/${yearName}/player/${sessionContacts[session.contactId].slug}`}>{sessionContacts[session.contactId].name}</GeneralLink></span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>
    </div>
  )
}
