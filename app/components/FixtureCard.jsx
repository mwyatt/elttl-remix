'use client'

import GeneralLink from '@/components/GeneralLink'
import DatePretty from '@/components/DatePretty'
import classNames from 'classnames'

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled }) {
  return (
    <GeneralLink
      href={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className={classNames({
        'border-stone-500 border text-stone-500': !timeFulfilled,
        'border-primary-500 border text-primary-500': timeFulfilled,
        'rounded shadow-md flex flex-col justify-center': true
      })}
    >
      <>
        {timeFulfilled && (
          <span className='text-tertiary-500 text-xs mb-1 block text-right mt-2 mr-2'>
            Fulfilled <DatePretty time={timeFulfilled} />
          </span>
        )}
        <span className='flex gap-2 border-b border-dashed px-2'>
          <span className='flex-grow'>{teamLeft.name}</span>
          <span className=''>{teamLeft.score}</span>
        </span>
        <span className='flex gap-2 px-2 pb-1'>
          <span className='flex-grow'>{teamRight.name}</span>
          <span className=''>{teamRight.score}</span>
        </span>
      </>
    </GeneralLink>
  )
}
