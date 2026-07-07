const DIFFICULTY_SHIFT = 60
const LEAGUE_AVERAGE_DIFFICULTY = 55

const getTo2Dp = (num) => Number(num.toFixed(2));

export function convertRankChangeToDifficultyScore(rankChange) {
  return rankChange + DIFFICULTY_SHIFT
}

export function getAverageDifficulty(difficultyScores) {
  const total = difficultyScores.reduce((sum, v) => sum + v, 0);
  return total / difficultyScores.length;
}

export function difficultyFactor(difficultyScores) {
  const avg = getAverageDifficulty(difficultyScores);
  return getTo2Dp(avg / LEAGUE_AVERAGE_DIFFICULTY);
}

export  function participationFactor(played, totalMatches) {
  const pct = played / totalMatches;

  if (pct < 0.50) return 0;
  if (pct < 0.60) return 0.90;
  if (pct < 0.70) return 1.00;
  if (pct < 0.80) return 1.05;
  if (pct < 0.90) return 1.10;
  return 1.15;
}

export function baseMerit(won, played) {
  return played > 0 ? getTo2Dp(won / played) : 0;
}

export function meritScore(base, pf, df) {
  return getTo2Dp(base * pf * df);
}
