const EncounterStatus = {
  NONE: '',

  // Excludes the encounter from being counted in the merit table for players
  EXCLUDE: 'exclude',

  // Marks the encounter as doubles so that rank changes are not applied
  DOUBLES: 'doubles',

  // @todo for public fixture submission
  DRAFT: 'draft'
}

export default EncounterStatus
