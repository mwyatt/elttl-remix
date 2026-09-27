import {BiMap} from 'react-icons/bi'
import {Link} from "react-router";

export default function DirectionsButton ({ url }) {
  return (
    <Link to={url} target='_blank' rel='noreferrer' className='border border-primary-500 text-primary-500 p-2 pr-3 flex items-center gap-2 rounded focus:outline-2 focus:outline-offset-2 focus:outline-stone-500 active:border-stone-700 flex-nowrap font-bold'>
      <span><BiMap size={24} /></span>
      <span>Directions</span>
    </Link>

  )
}
