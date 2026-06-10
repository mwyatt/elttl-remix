'use client'

import React from 'react'
import { BiSolidChevronDown, BiSolidChevronUp } from 'react-icons/bi'

export default function MenuPrimary ({ items, primaryOpenStatuses, setPrimaryOpenStatuses }) {
  const handleClick = (index) => {
    const updatedStatuses = primaryOpenStatuses.map((status, i) => ({
      ...status,
      isOpen: i === index ? !status.isOpen : false
    }))
    setPrimaryOpenStatuses(updatedStatuses)
  }

  return (
    <div className='flex-grow flex-wrap basis-0'>
      <nav className='flex h-full text-xl'>
        {items.map((item, index) => (
          <div
            key={index}
            className={[
              'relative p-3 sm:p-4 border-l flex grow gap-4 items-center cursor-pointer',
              primaryOpenStatuses[index].isOpen
                ? 'bg-stone-100'
                : ''
            ].join(' ')}
            onClick={() => handleClick(index)}
          >
            <span className='grow'>{item.name}</span>
            <span className={[
              'content-center'
            ].join(' ')}
            >
              {primaryOpenStatuses[index].isOpen
                ? <BiSolidChevronUp size={30} />
                : <BiSolidChevronDown size={30} />}
            </span>
          </div>
        ))}
      </nav>
    </div>
  )
}
