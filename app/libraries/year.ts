export function getSeasonName(currentYearName: string) {
  const currentYear = parseInt(currentYearName);
  return `${currentYearName}-${currentYear + 1}`;
}

/**
 * Legacy support for years before weeks and season was introduced
 * So for example on the team page we want to just show a block of fixtures, rather than the timeline
 */
export const YearNameBeforeWeeks = '2024'

export function doesYearSupportWeeks(yearName: string) {
  const currentYear = parseInt(yearName);
  return currentYear > parseInt(YearNameBeforeWeeks);
}
