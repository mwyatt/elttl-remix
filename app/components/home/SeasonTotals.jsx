'use client'

import GeneralLink from '@/components/GeneralLink'
import { allHomeButtonStyles } from '@/lib/styles'

const Panel = ({ name, total, url }) => (
  <GeneralLink
    href={url} className='flex-wrap flex p-6 grow text-xl flex-col items-center gap-2 rounded bg-secondary-500 text-white'
  >
    <span className='text-5xl font-semibold'>{total}</span>
    {name}
  </GeneralLink>
)

export default function SeasonTotals ({ yearName, totals }) {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-center'>
        <h2 className='text-2xl grow'>Season {yearName}-{parseInt(yearName) + 1}</h2>
        <div className='flex gap-2'>
          <GeneralLink className={allHomeButtonStyles} href={`/result/${yearName}`}>Team Information</GeneralLink>
          <GeneralLink className={allHomeButtonStyles} href={`/result/${yearName}/season`}>Season Overview</GeneralLink>
        </div>
      </div>
      <div className='flex flex-wrap gap-3'>
        <Panel name='Divisions' url={`/result/${yearName}`} total={totals.divisions} />
        <Panel name='Teams' url={`/result/${yearName}`} total={totals.teams} />
        <Panel name='Players' url={`/result/${yearName}`} total={totals.players} />
        <Panel
          name='Fixtures Fulfilled' url={`/result/${yearName}/season`} total={
            <span>
              {totals.fixtures.fulfilled}<span className='opacity-50'>/{totals.fixtures.total}</span>
            </span>
            }
        />
      </div>
    </div>
  )
}
