'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export default function RelativeTime ({ timestamp }) {
  dayjs.extend(relativeTime)

  const [fromNow, setFromNow] = useState('')

  useEffect(() => {
    setFromNow(dayjs.unix(timestamp).fromNow())
  }, [timestamp])

  return <span>{fromNow}</span>
}
