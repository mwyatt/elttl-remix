import dayjs from 'dayjs'

export const getDayAfter = (timeStart) => {
  return dayjs.unix(timeStart).add(1, 'day')
}

export const formatDayWithSuffixOfMonth = (dayJsDate) => {
  const date = dayJsDate.date()
  const suffix = ['th', 'st', 'nd', 'rd'][(date % 10 > 3 || ~~(date % 100 / 10) === 1) ? 0 : date % 10]
  return `${date}${suffix} of ${dayJsDate.format('MMMM')}`
}

export const formatDateWithDayAndSuffixOfMonth = (dayJsDate) => {
  const date = dayJsDate.date()
  const prefix = dayJsDate.format('dddd')
  const suffix = ['th', 'st', 'nd', 'rd'][(date % 10 > 3 || ~~(date % 100 / 10) === 1) ? 0 : date % 10]
  return `${prefix} the ${date}${suffix} of ${dayJsDate.format('MMMM')}`
}

// @todo will not work for events with specific date
// needs to get the week which is closest to today
export const isCurrentWeek = (weekTimeStart) => {
  const weekStart = dayjs.unix(weekTimeStart).startOf('week')
  const todayStart = dayjs().startOf('week')

  return weekStart.isSame(todayStart)
}

export const getClosestWeekId = (weeks) => {
  const nowUnix = dayjs().unix()
  let closestWeek = null

  weeks.map(week => {
    // Get positive difference
    let timeDifference = week.timeStart - nowUnix
    if (timeDifference !== 0 && timeDifference < 0) {
      timeDifference = -timeDifference
    }
    if (!closestWeek) {
      closestWeek = {
        id: week.id,
        timeDifference
      }
    } else if (timeDifference < closestWeek.timeDifference) {
      closestWeek = {
        id: week.id,
        timeDifference
      }
    }

    return true
  })

  return closestWeek.id
}
