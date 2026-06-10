export function getHandicap (playerRank) {
  if (playerRank >= 2600) {
    return 0
  } else if (playerRank <= 150) {
    return 70
  } else {
    return Math.ceil((2600 - playerRank) / 35)
  }
}

export function getStartValue (diff) {
  if (diff >= 50) return 16
  if (diff >= 42) return 15
  if (diff >= 35) return 14
  if (diff >= 29) return 13
  if (diff >= 24) return 12
  if (diff >= 20) return 11
  if (diff >= 17) return 10
  if (diff >= 14) return 9
  if (diff >= 12) return 8
  if (diff >= 10) return 7
  if (diff >= 8) return 6
  if (diff >= 5) return 5
  if (diff === 4) return 4
  if (diff === 3) return 3
  if (diff === 2) return 2
  if (diff === 1) return 1
  return 0
}
