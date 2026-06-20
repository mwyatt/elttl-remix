export default function RankChange ({ rankChange }) {
  if (rankChange === null || rankChange === 0 || rankChange === undefined) {
    return
  }

  const classNames = [
    'rounded-full p-1 inline-block w-10 h-7 text-center mx-2 text-sm max-md:hidden'
  ]

  const getRankChangeText = (change) => {
    if (change < 0) {
      return change
    }
    return `+${change}`
  }

  const getBgColor = (change) => {
    let className = 'border text-green-500 border-green'
    if (change < 0) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change < -10) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change < -20) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change < -30) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change < -40) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change < -50) {
      className = 'border border-tertiary-500 text-tertiary-500'
    }
    if (change > 0) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 10) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 20) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 30) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 40) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 50) {
      className = 'border text-green-500 border-green-500'
    }
    if (change > 60) {
      className = 'border text-green-500 border-green-500'
    }
    return className
  }

  classNames.push(getBgColor(rankChange))

  return (
    <span
      className={classNames.join(' ')}
      title='Players ranking change as a result of this encounter'
    >
      {getRankChangeText(rankChange)}
    </span>
  )
}
