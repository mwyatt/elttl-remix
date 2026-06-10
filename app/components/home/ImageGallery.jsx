'use client'

import GeneralLink from '@/components/GeneralLink'
import { DeveloperEmail } from '@/constants/MetaData'
import { linkStyles } from '@/lib/styles'

export default function ImageGallery () {
  return (
    <div className='mb-6 px-4 md:px-0'>
      <div className='flex items-center mb-4'>
        <h2 className='text-2xl grow'>Gallery</h2>
      </div>
      <div className='flex flex-wrap gap-3 mb-6'>
        <p>Want your images included in the gallery and featured on the homepage? Send them in to <GeneralLink className={linkStyles.join(' ')} href={`mailto:${DeveloperEmail}`}>{DeveloperEmail}</GeneralLink>.</p>
      </div>
    </div>
  )
}
