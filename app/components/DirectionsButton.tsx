import { BiMap } from 'react-icons/bi'
import {Link} from "react-router";

export default function DirectionsButton ({ url }) {
  return (
    <Link to={url} target='_blank' rel='noreferrer' className='border border-primary-500 text-primary-500 p-2 flex items-center gap-3 rounded text-xl font-semibold max-w-64 p-2'>
      <span><BiMap size={30} /></span>
      <span>Google Maps Directions</span>
    </Link>

  )
}
