export const WeekTypes = {
  nothing: 0,
  fixture: 1,
  vets: 2,
  fred0: 3,
  fred1: 4,
  fred2: 5,
  fred3: 6,
  div: 7,
  presentation: 8,
  agm: 9,
  catchup: 10,
  closedCompetition: 11,
  fredSemis: 12,
  fredFinal: 13
}

export const FredHoldenCupWeekTypes = [
  WeekTypes.fred0,
  WeekTypes.fred1,
  WeekTypes.fred2,
  WeekTypes.fred3,
  WeekTypes.fredSemis,
  WeekTypes.fredFinal
]

export const ExactDayWeekTypes = [
  WeekTypes.presentation,
  WeekTypes.agm,
  WeekTypes.closedCompetition,
  WeekTypes.fredSemis,
  WeekTypes.fredFinal
]

export const NonEventTypes = [
  WeekTypes.fixture, WeekTypes.catchup, WeekTypes.nothing
]

export const WeekTypeLabels = {
  [WeekTypes.nothing]: 'No Events Scheduled',
  [WeekTypes.fixture]: 'Fixtures',
  [WeekTypes.vets]: 'Vets Competitions',
  [WeekTypes.fred0]: 'Fred Holden Preliminary Round',
  [WeekTypes.fred1]: 'Fred Holden 1st Round',
  [WeekTypes.fred2]: 'Fred Holden 2nd Round',
  [WeekTypes.fred3]: 'Fred Holden 3rd Round',
  [WeekTypes.div]: 'Divisional Handicap Competitions',
  [WeekTypes.presentation]: 'Presentation Night',
  [WeekTypes.agm]: 'Annual General Meeting',
  [WeekTypes.catchup]: 'Catch-Up Week',
  [WeekTypes.closedCompetition]: 'Annual Closed Competition - The Big Day',
  [WeekTypes.fredSemis]: 'Fred Holden Semi Finals',
  [WeekTypes.fredFinal]: 'Fred Holden Final'
}

export const getWeekTypeLabel = (weekType) =>
  WeekTypeLabels[weekType] ?? 'Unknown Week Type'
