export const SIDE_LEFT = 'left'
export const SIDE_RIGHT = 'right'

export const scorecardStructure = [
  [1, 2],
  [3, 1],
  [2, 3],
  [3, 2],
  [1, 3],
  ['doubles', 'doubles'],
  [2, 1],
  [3, 3],
  [2, 2],
  [1, 1]
]

export const maxEncounters = scorecardStructure.length
export const minEncounters = 3

export const rankChangeMap = {
  24: [[12, -8], [12, -8]],
  49: [[11, -7], [14, -9]],
  99: [[9, -6], [17, -11]],
  149: [[8, -5], [21, -14]],
  199: [[6, -4], [26, -17]],
  299: [[5, -3], [33, -22]],
  399: [[3, -2], [45, -30]],
  499: [[2, -1], [60, -40]],
  99999: [[0, -0], [75, -50]]
}

export function getSides () {
  return [SIDE_LEFT, SIDE_RIGHT]
}

export function getSidesCapitalized () {
  return [
    SIDE_LEFT.charAt(0).toUpperCase() + SIDE_LEFT.slice(1),
    SIDE_RIGHT.charAt(0).toUpperCase() + SIDE_RIGHT.slice(1)
  ]
}

export function getOtherSide (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? SIDE_RIGHT : SIDE_LEFT
}

export function getOtherSideCapitalized (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? SIDE_RIGHT.charAt(0).toUpperCase() + SIDE_RIGHT.slice(1) : SIDE_LEFT.charAt(0).toUpperCase() + SIDE_LEFT.slice(1)
}

export function getSideCapitalized (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide.charAt(0).toUpperCase() + normalisedSide.slice(1)
}

export function getSideIndex (side) {
  const normalisedSide = side.toLowerCase()
  return normalisedSide === SIDE_LEFT ? 0 : 1
}
