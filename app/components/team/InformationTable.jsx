'use client'

import GeneralLink from '@/components/GeneralLink'
import { linkStyles } from '@/lib/styles'
import { getShortPlayerName } from '@/lib/player'

export default function InformationTable ({ yearName, teams }) {
  const getContact = (landline, mobile) => {
    if (landline && mobile) {
      return <span>{landline} / {mobile}</span>
    }
    if (landline) {
      return <span>{landline}</span>
    }
    if (mobile) {
      return <span>{mobile}</span>
    }
  }

  return (
    <table className='table-auto w-full mt-4 mb-12'>
      <thead>
        <tr className='text-left'>
          <th className='p-2 md:p-4'>Team</th>
          <th className='p-2 md:p-4 hidden sm:table-cell'>Venue</th>
          <th className='p-2 md:p-4'>Secretary</th>
          <th className='p-2 md:p-4'>Contact</th>
        </tr>
      </thead>
      <tbody>

        {teams.map((team, index) => (
          <tr key={index} className='border-t border-dashed hover:bg-gray-100'>
            <td className='p-2 md:p-4'>
              <GeneralLink className={linkStyles.join(' ')} href={`/result/${yearName}/team/${team.slug}`}>{team.name}</GeneralLink>
            </td>
            <td className='p-2 md:p-4 hidden sm:table-cell'>
              <GeneralLink className={linkStyles.join(' ')} href={`/result/${yearName}/venue/${team.venueSlug}`}>{team.venueName}</GeneralLink>
            </td>
            <td className='p-2 md:p-4'>
              {team.secretarySlug && (
                <GeneralLink className={linkStyles.join(' ')} href={`/result/${yearName}/player/${team.secretarySlug}`}>
                  <span className='sm:hidden'>{getShortPlayerName(team.secretaryName)}</span>
                  <span className='hidden sm:inline'>{team.secretaryName}</span>
                </GeneralLink>
              )}
            </td>
            <td className='p-2 md:p-4'>
              {getContact(team.secretaryPhoneLandline, team.secretaryPhoneMobile)}
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  )
}
