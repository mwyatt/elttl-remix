import { DeveloperEmail } from '~/constants/MetaData'
import { linkStyles } from '~/styles/ui-classes'
import {Link} from "react-router";

export default function ImageGallery () {
  return (
    <div className='mb-6 px-4 md:px-0'>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>Gallery</h2>
      </div>
      <div className='flex flex-wrap gap-3 mb-6'>
        <p>Want your images included in the gallery and featured on the homepage? Send them in to <Link className={linkStyles.join(' ')} to={`mailto:${DeveloperEmail}`}>{DeveloperEmail}</Link>.</p>
      </div>
    </div>
  )
}
