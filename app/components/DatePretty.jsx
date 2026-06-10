'use client'

import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

export default function DatePretty ({ time }) {
  const [dateTimeString, setDateTimeString] = useState('')
  const [isoString, setIsoString] = useState('')

  useEffect(() => {
    setDateTimeString(dayjs.unix(time).format('DD/MM/YYYY HH:mm'))
    setIsoString(dayjs.unix(time).toISOString())
  }, [time])

  return (
    <time dateTime={isoString}>
      {dateTimeString}
    </time>
  )
}
