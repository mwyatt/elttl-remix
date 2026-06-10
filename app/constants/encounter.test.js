import '@testing-library/jest-dom'
import { getSides, getSideCapitalized, getSidesCapitalized, SIDE_LEFT, getOtherSide, getSideIndex } from '@/constants/encounter'
import { describe, it, expect } from '@jest/globals'

describe('encounter', () => {
  it('has sides and can transform them', () => {
    const sides = getSides()
    expect(sides).toHaveLength(2)
    expect(sides).toContain('left')
    expect(sides).toContain('right')

    const capitalizedSides = getSidesCapitalized()
    expect(capitalizedSides).toHaveLength(2)
    expect(capitalizedSides).toContain('Left')
    expect(capitalizedSides).toContain('Right')

    const capitalizedSide = getSideCapitalized(SIDE_LEFT)
    expect(capitalizedSide).toEqual('Left')
    expect(capitalizedSide).not.toEqual('Right')

    const otherSide = getOtherSide(SIDE_LEFT)
    expect(otherSide).toEqual('right')

    const sideIndex = getSideIndex(SIDE_LEFT)
    expect(sideIndex).toEqual(0)

    expect(getSideIndex(capitalizedSides[0])).toEqual(0)
    expect(getSideIndex(capitalizedSides[1])).toEqual(1)
  })
})
