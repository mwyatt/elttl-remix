import {SIDE_LEFT} from "~/constants/encounter";

export function getContextualScoreStatus(
  isSideLeft: boolean,
  scoreLeft,
  scoreRight,
) {
  const contextScore = isSideLeft ? scoreLeft : scoreRight
  const contextOpposingScore = isSideLeft ? scoreRight : scoreLeft

  if (contextScore > contextOpposingScore) {
    return 'won'
  }
  if (contextScore < contextOpposingScore) {
    return 'lost'
  }

  return 'drew'
}
