import {Link} from "react-router";

export default function DivisionalSubMenu ({ year, division }) {
  return (
    <div className='sm:flex items-center justify-center border border-primary-500 rounded my-6'>
      <Link className='block p-4 text-primary-500 font-bold sm:border-r border-primary-500' to={`/result/${year}/${division}/league`}>
        League Table
      </Link>
      <Link className='block p-4 text-primary-500 font-bold border-t sm:border-t-0 sm:border-r border-primary-500' to={`/result/${year}/${division}/merit`}>
        Merit Table
      </Link>
      <Link className='block p-4 text-primary-500 font-bold border-t sm:border-t-0 border-primary-500' to={`/result/${year}/${division}/doubles-merit`}>
        Doubles Merit Table
      </Link>
    </div>
  )
}
