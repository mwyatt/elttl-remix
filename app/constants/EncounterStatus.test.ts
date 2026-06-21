import EncounterStatus from '~/constants/EncounterStatus'
import { describe, it, expect } from 'vitest'

describe('EncounterStatus', () => {
  it('has doubles status', () => {
    expect(EncounterStatus.DOUBLES).toBe('doubles')
  })
})