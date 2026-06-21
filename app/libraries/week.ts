import { getDayAfter } from '~/libraries/date'
import { ExactDayWeekTypes } from '~/constants/Week'
import dayjs from 'dayjs'

// Moves the week commencing date forward to match the style used by elttl
export const getWeekDate = (weekType, timeStart) => {
  const weekCommencingDate = getDayAfter(timeStart)
  const eventDate = dayjs.unix(timeStart)

  if (ExactDayWeekTypes.includes(weekType)) {
    return eventDate
  }

  return weekCommencingDate
}
