'use client'

import DatePretty from '~/components/DatePretty'
import classNames from 'classnames'
import {Link} from "react-router";

export default function FixtureCard ({ year, teamLeft, teamRight, timeFulfilled, showDateFulfilled = false }) {
  // @todo highlight winning score bold

  return (
    <Link
      to={`/result/${year}/fixture/${teamLeft.slug}/${teamRight.slug}`}
      className={classNames({
        'border-stone-500 border text-stone-500': !timeFulfilled,
        'border-primary-500 border text-primary-500 focus:outline-2 focus:outline-offset-2 focus:outline-stone-500 active:border-stone-700': timeFulfilled,
        'rounded shadow-md flex flex-col justify-center p-2': true
      })}
    >
      <>
        {timeFulfilled && showDateFulfilled && (
          <span className='text-tertiary-500 text-xs mb-1 block text-right mt-2 mr-2'>
            Fulfilled <DatePretty time={timeFulfilled} />
          </span>
        )}
        <span className='flex gap-2 border-b border-b-neutral-300 border-dashed'>
          <span className='flex-grow'>{teamLeft.name}</span>
            {timeFulfilled && (<span className=''>{teamLeft.score}</span>)}
        </span>
        <span className='flex gap-2'>
          <span className='flex-grow'>{teamRight.name}</span>
            {timeFulfilled && (<span className=''>{teamRight.score}</span>)}
        </span>
      </>
    </Link>
  )
}
