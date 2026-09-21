export function getSeasonName(currentYearName: string) {
  const currentYear = parseInt(currentYearName);
  return `${currentYearName}-${currentYear + 1}`;
}
