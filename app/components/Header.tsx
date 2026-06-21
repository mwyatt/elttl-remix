import ElttlEmblem from '~/components/icons/ElttlEmblem'
import MenuPrimary from '~/components/MenuPrimary'
import { useState } from 'react'
import { BiBook, BiCode, BiMap, BiNews, BiQuestionMark, BiTrophy } from 'react-icons/bi'
import {Link} from "react-router";

export default function Header ({ appName, menuPrimary }) {
  const [primaryOpenStatuses, setPrimaryOpenStatuses] = useState(
    menuPrimary.map(() => ({ isOpen: false }))
  )

  const getIcon = (name) => {
    switch (name) {
      case 'About Us':
        return <BiQuestionMark className='mt-1 mr-2' size={20} />
      case 'Download Handbook':
        return <BiBook className='mt-1 mr-2' size={20} />
      case 'Fixtures':
        return <BiCode className='mt-1 mr-2' size={20} />
      case 'Press Releases':
        return <BiNews className='mt-1 mr-2' size={20} />
      case 'Competitions':
        return <BiTrophy className='mt-1 mr-2' size={20} />
      case 'Contact us':
        return <BiMap className='mt-1 mr-2' size={20} />
      default:
        return null
    }
  }

  return (
    <header className='border-b border-b-slate-300 bg-white drop-shadow-sm'>
      <div className='max-w-[1440px] sm:flex mx-auto border-l border-l-slate-200'>
        <Link
          to='/'
          className='flex-1 flex flex-grow gap-2 sm:gap-4 p-4 items-center justify-center sm:justify-start border-b sm:border-none sm:max-w-[500px]'
          title={`${appName} - Home`}
        >
          <ElttlEmblem className='md:hidden' width='50px' />
          <ElttlEmblem className='hidden md:block' width='120px' />
          <span className=''>
            <span className='hidden md:block text-4xl'>{appName}</span>
            <span className='md:hidden text-5xl font-bold'>ELTTL</span>
          </span>
        </Link>
        <MenuPrimary items={menuPrimary} primaryOpenStatuses={primaryOpenStatuses} setPrimaryOpenStatuses={setPrimaryOpenStatuses} />
      </div>
      <div>
        <div className='max-w-[1440px] mx-auto'>
          {menuPrimary.map((primaryItem, index) => (
            <div
              key={primaryItem.name}
              className={[
                primaryOpenStatuses[index].isOpen ? 'block' : 'hidden',
                'h-full'
              ].join(' ')}
            >
              {primaryItem.children && (
                <div className='lg:flex lg:gap-4 lg:justify-center lg:items-center bg-stone-100'>
                  {primaryItem.children.map((secondaryItem) => (
                    <div key={secondaryItem.name} className=' lg:p-6 lg:text-lg'>
                      <Link
                        className='flex py-4 px-4 block text-lg text-primary-500 bg-white font-semibold rounded'
                        to={secondaryItem.url}
                        target={secondaryItem.target || '_self'}
                      >
                        {getIcon(secondaryItem.name)}
                        {secondaryItem.name}
                      </Link>

                      {secondaryItem.children && (
                        <div className='sm:flex lg:block'>
                          {secondaryItem.children.map((tertiaryItem) => (
                            <div key={tertiaryItem.name}>
                              <Link className='px-4 py-4 block text-lg border-t border-t-neutral-300' to={tertiaryItem.url}>{tertiaryItem.name}</Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </header>

  )
}
