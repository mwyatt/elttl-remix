import GeneralLink from '@/components/GeneralLink'
import { BiMap } from 'react-icons/bi'

export default function DirectionsButton ({ url }) {
  return (
    <GeneralLink href={url} target='_blank' rel='noreferrer' className='border border-primary-500 text-primary-500 p-2 flex items-center gap-3 rounded text-xl font-semibold max-w-64 p-2'>
      <span><BiMap size={30} /></span>
      <span>Google Maps Directions</span>
    </GeneralLink>

  )
}
