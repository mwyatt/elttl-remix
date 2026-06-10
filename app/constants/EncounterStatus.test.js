import '@testing-library/jest-dom'
import EncounterStatus from './EncounterStatus'
import { describe, it, expect } from '@jest/globals'

describe('EncounterStatus', () => {
  it('has doubles status', () => {
    expect(EncounterStatus.DOUBLES).toBe('doubles')
  })
})
