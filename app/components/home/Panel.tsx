'use client'

import classNames from 'classnames'

export default function Panel ({ children, rowSpan, colSpan }) {
  return (
    <div className={classNames({
      'p-6 border border-stone-300 sm:rounded': true,
      'sm:shadow-md': true,
      'row-span-2': rowSpan === 2,
      'col-span-2': colSpan === 2
    })}
    >
      {children}
    </div>
  )
}
