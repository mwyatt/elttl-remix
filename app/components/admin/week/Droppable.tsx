import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import classNames from 'classnames'

function Droppable (props) {
  const week = props.week
  const { isOver, setNodeRef } = useDroppable({
    id: week.id
  })

  const classes = classNames('p-4 border border-dashed border-stone-300 rounded w-full min-w-20', {
    'bg-stone-200': isOver
  })

  return (
    <div ref={setNodeRef} className={classes}>
      {props.children}
    </div>
  )
}

export { Droppable }
