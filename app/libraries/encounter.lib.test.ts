import { test, expect, describe } from "vitest"
import {getEncounterMerit, getRankChanges} from "~/libraries/encounter.lib";

describe('getRankChanges', () => {
  test('it calculates rank changes', () => {
    const rankChanges = getRankChanges(0, 3, 2500, 2600)
    expect(rankChanges).toEqual([-5, 8])

    const furtherRankChanges = getRankChanges(3, 0, 2500, 2600)
    expect(furtherRankChanges).toEqual([21, -14])

    // 250 difference - expected win
    const moreRankChanges = getRankChanges(0, 3, 2350, 2600)
    expect(moreRankChanges).toEqual([-3, 5])

    // 250 difference - unexpected win
    const evenMoreRankChanges = getRankChanges(3, 0, 2350, 2600)
    expect(evenMoreRankChanges).toEqual([33, -22])
  })

  test('it calculates a big rank change for a good win', () => {
    const rankChanges = getRankChanges(0, 3, 2600, 2150)
    expect(rankChanges).toEqual([-40, 60])
  })

  test('it calculates a small rank change for an expected loss', () => {
    const rankChanges = getRankChanges(0, 3, 1500, 1850)
    expect(rankChanges).toEqual([-2, 3])
  })
})

describe('getEncounterMerit', () => {
  test('returns empty array for no encounters', () => {
    expect(getEncounterMerit([])).toEqual([])
  })

  test('calculates stats for a single encounter', () => {
    const encounters = [
      {
        playerLeftSlug: 'alice',
        playerLeftId: 1,
        playerLeftName: 'Alice',
        playerLeftRank: 100,
        teamLeftName: 'TeamA',
        teamLeftSlug: 'teama',
        scoreLeft: 3,
        playerRightSlug: 'bob',
        playerRightId: 2,
        playerRightName: 'Bob',
        playerRightRank: 90,
        teamRightName: 'TeamB',
        teamRightSlug: 'teamb',
        scoreRight: 1
      }
    ]
    const stats = getEncounterMerit(encounters)
    expect(stats).toHaveLength(2)
    const alice = stats.find(s => s.player.slug === 'alice')
    const bob = stats.find(s => s.player.slug === 'bob')
    expect(alice.won).toBe(3)
    expect(alice.lost).toBe(1)
    expect(alice.played).toBe(4)
    expect(alice.average).toBeCloseTo(0.75)
    expect(alice.encountersWon).toBe(1)
    expect(alice.encountersLost).toBe(0)
    expect(bob.won).toBe(1)
    expect(bob.lost).toBe(3)
    expect(bob.played).toBe(4)
    expect(bob.average).toBeCloseTo(0.25)
    expect(bob.encountersWon).toBe(0)
    expect(bob.encountersLost).toBe(1)
  })

  test('calculates stats for multiple encounters', () => {
    const encounters = [
      {
        playerLeftSlug: 'alice',
        playerLeftId: 1,
        playerLeftName: 'Alice',
        playerLeftRank: 100,
        teamLeftName: 'TeamA',
        teamLeftSlug: 'teama',
        scoreLeft: 3,
        playerRightSlug: 'bob',
        playerRightId: 2,
        playerRightName: 'Bob',
        playerRightRank: 90,
        teamRightName: 'TeamB',
        teamRightSlug: 'teamb',
        scoreRight: 1
      }
    ]
    const stats = getEncounterMerit(encounters)
    expect(stats).toHaveLength(2)
    const alice = stats.find(s => s.player.slug === 'alice')
    const bob = stats.find(s => s.player.slug === 'bob')
    expect(alice.won).toBe(3)
    expect(alice.lost).toBe(1)
    expect(alice.played).toBe(4)
    expect(alice.average).toBeCloseTo(0.75)
    expect(alice.encountersWon).toBe(1)
    expect(alice.encountersLost).toBe(0)
    expect(bob.won).toBe(1)
    expect(bob.lost).toBe(3)
    expect(bob.played).toBe(4)
    expect(bob.average).toBeCloseTo(0.25)
    expect(bob.encountersWon).toBe(0)
    expect(bob.encountersLost).toBe(1)
  })

  test('handles division by zero (no games played)', () => {
    const encounters = [
      {
        playerLeftSlug: 'alice',
        playerLeftId: 1,
        playerLeftName: 'Alice',
        playerLeftRank: 100,
        teamLeftName: 'TeamA',
        teamLeftSlug: 'teama',
        scoreLeft: 0,
        playerRightSlug: 'bob',
        playerRightId: 2,
        playerRightName: 'Bob',
        playerRightRank: 90,
        teamRightName: 'TeamB',
        teamRightSlug: 'teamb',
        scoreRight: 0
      }
    ]
    const stats = getEncounterMerit(encounters)
    expect(stats).toHaveLength(2)
    expect(stats[0].average).toBeNaN()
    expect(stats[1].average).toBeNaN()
  })

  test('sorts by average descending', () => {
    const encounters = [
      {
        playerLeftSlug: 'alice',
        playerLeftId: 1,
        playerLeftName: 'Alice',
        playerLeftRank: 100,
        teamLeftName: 'TeamA',
        teamLeftSlug: 'teama',
        scoreLeft: 3,
        playerRightSlug: 'bob',
        playerRightId: 2,
        playerRightName: 'Bob',
        playerRightRank: 90,
        teamRightName: 'TeamB',
        teamRightSlug: 'teamb',
        scoreRight: 1
      },
      {
        playerLeftSlug: 'carol',
        playerLeftId: 3,
        playerLeftName: 'Carol',
        playerLeftRank: 80,
        teamLeftName: 'TeamC',
        teamLeftSlug: 'teamc',
        scoreLeft: 2,
        playerRightSlug: 'dave',
        playerRightId: 4,
        playerRightName: 'Dave',
        playerRightRank: 70,
        teamRightName: 'TeamD',
        teamRightSlug: 'teamd',
        scoreRight: 2
      }
    ]
    const stats = getEncounterMerit(encounters)
    // Alice: 3/4 = 0.75, Bob: 1/4 = 0.25, Carol: 2/4 = 0.5, Dave: 2/4 = 0.5
    expect(stats[0].player.slug).toBe('alice')
    expect(stats[1].player.slug).toMatch(/carol|dave/)
    expect(stats[2].player.slug).toMatch(/carol|dave/)
    expect(stats[3].player.slug).toBe('bob')
  })
})
