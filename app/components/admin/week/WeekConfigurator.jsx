'use client'

import { useState } from 'react'
import { WeekTypeLabels, WeekTypes } from '@/constants/Week'
import { DndContext } from '@dnd-kit/core'
import { Draggable } from './Draggable'
import { Droppable } from './Droppable'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'
import FullLoader from '@/components/FullLoader'
import Feedback from '@/components/Feedback'
import lodash from 'lodash'

dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(utc)

export function WeekConfigurator ({ cookie, divisions, weeks, fixtures }) {
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [currentDivisionId, setCurrentDivisionId] = useState(0)
  const [currentTeamId, setCurrentTeamId] = useState(0)
  const [weekRange, setWeekRange] = useState({ start: '', end: '' })
  const weeksAreEstablished = weeks.length > 0

  const initWeeks = (weeks) => {
    weeks.forEach(week => {
      week.dateStart = dayjs.unix(week.timeStart)
    })

    return weeks
  }

  const [stateWeeks, setWeeks] = useState(initWeeks(weeks))

  const [stateFixtures, setStateFixtures] = useState(fixtures)

  const isFixtureVisible = (fixture) => {
    return (currentDivisionId === 0 ||
    fixture.divisionId === currentDivisionId) &&
      (currentTeamId === 0 ||
      (fixture.teamLeftId === currentTeamId || fixture.teamRightId === currentTeamId))
  }

  const getDraggableFixtures = () => {
    const draggables = []

    stateFixtures.forEach(fixture => {
      if (fixture.weekId === null && isFixtureVisible(fixture)) {
        draggables.push(
          <Draggable key={fixture.id} id={fixture.id}>
            <div className='border border-stone-300 p-1 rounded'>
              {fixture.fullName}
            </div>
          </Draggable>
        )
      }
    })

    return draggables
  }

  const getDroppedFixtureDataByWeekId = () => {
    const weekData = {}
    stateWeeks.forEach(week => {
      weekData[week.id] = {}
      weekData[week.id].fixtures = stateFixtures.filter(fixture => {
        return fixture.weekId === week.id && isFixtureVisible(fixture)
      })
      weekData[week.id].fixturesHidden = stateFixtures.filter(fixture => {
        return fixture.weekId === week.id && isFixtureVisible(fixture) === false
      })
    })
    return weekData
  }

  const droppedFixtureDataByWeekId = getDroppedFixtureDataByWeekId()

  const handleChangeWeekType = (weekId, weekType) => {
    const week = stateWeeks.filter(week => week.id === weekId)
    week.type = weekType
    setWeeks((prevWeeks) => {
      return prevWeeks.map((w) => {
        if (w.id === weekId) {
          return {
            ...w,
            type: weekType
          }
        }
        return w
      })
    })
  }

  const handleUnplaceAllFixtures = () => {
    setStateFixtures((prevFixtures) => {
      return prevFixtures.map((fixture) => {
        return {
          ...fixture,
          weekId: null
        }
      })
    })
  }

  const handlePlaceAllFixturesRandomly = () => {
    const fixtureWeeks = stateWeeks.filter(week => week.type === WeekTypes.fixture)

    divisions.forEach(division => {
      const divisionFixtures = stateFixtures.filter(fixture => fixture.divisionId === division.id)
      const chunkedFixtures = lodash.chunk(divisionFixtures, Math.ceil(divisionFixtures.length / fixtureWeeks.length))

      chunkedFixtures.forEach((fixtureChunk, index) => {
        const week = fixtureWeeks[index % fixtureWeeks.length]

        fixtureChunk.forEach(fixture => {
          fixture.weekId = week.id
        })
      })
    })

    setStateFixtures([...stateFixtures])
  }

  const handleAutoPlaceFixtures = () => {
    console.warn('Auto place will go through all unplaced fixtures and place them using the following rules:')
    console.warn('- Place fixtures only in weeks of type "fixture"')
    console.warn('- Distribute fixtures evenly across available weeks')
    console.warn('- Alternate home and away games where possible')
    console.warn('- Ensure no team has more than 1 home or away game in the same week')

    // const unplacedFixtures = stateFixtures.filter(fixture => fixture.weekId === null && fixture.divisionId === currentDivisionId)
    // const fixtureWeeks = stateWeeks.filter(week => week.type === WeekTypes.fixture)

    // const teamIds = lodash.uniq(unplacedFixtures.map(fixture => fixture.teamLeftId))

    // console.log({ fixtureWeeks, teamIds })

    // each team will play once a week
    // must alternate home and away
    // each team combination must not occur one week after the last
    // naive implementation: round robin assignment
    // let sideCurrent = SIDE_LEFT
    // teamIds.forEach(teamId => {
    //   getSideCapitalized(getOtherSide(sideCurrent))
    //   unplacedFixtures.filter(fixture => fixture.teamLeftId === teamId || fixture.teamRightId === teamId).forEach((fixture, index) => {
    // })
  }

  const handleSave = async () => {
    setIsLoading(true)

    // inject epoch timeStart for backend
    stateWeeks.forEach(week => {
      week.timeStart = week.dateStart.unix()
    })

    // store only necessary fixture data
    const fixturesWithWeekIds = stateFixtures.filter(fixture => fixture.weekId !== null)

    const payload = {
      weeks: stateWeeks,
      fixtures: fixturesWithWeekIds.map(fixture => ({
        id: fixture.id,
        weekId: fixture.weekId
      }))
    }

    const response = await fetch('/admin/api/week', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authentication: cookie
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    setFeedbackMessage(data.message)
    setIsLoading(false)
  }

  function parseIsoWeek (str) {
    const [year, week] = str.split('-W')

    return dayjs(year)
      .isoWeek(week)
      .startOf('week')
  }

  function getIsoWeeksBetween (startStr, endStr) {
    const start = parseIsoWeek(startStr)
    const end = parseIsoWeek(endStr)

    const weeks = []
    let cursor = start.clone()
    let weekId = 1

    while (cursor.isBefore(end) || cursor.isSame(end)) {
      // const isoYear = cursor.isoWeekYear()
      // const isoWeek = cursor.isoWeek().toString().padStart(2, '0')

      weeks.push({
        id: weekId++,
        dateStart: cursor.clone(),
        type: WeekTypes.fixture
      })

      cursor = cursor.add(1, 'week')
    }

    return weeks
  }

  const handleGenerateWeeks = () => {
    if (weeksAreEstablished) {
      return setFeedbackMessage('Weeks have already been established.')
    }

    if (weekRange.start === '' || weekRange.end === '') {
      return setFeedbackMessage('Please select both start and end weeks')
    }

    const weeksBetween = getIsoWeeksBetween(weekRange.start, weekRange.end)

    setWeeks(weeksBetween)
  }

  const handleRemoveAllWeeks = () => {
    setStateFixtures(prevFixtures => {
      return prevFixtures.map(fixture => {
        return {
          ...fixture,
          weekId: null
        }
      })
    })
    setWeeks([])
  }

  const handleChangeWeekRange = function (key, value) {
    setWeekRange((prev) => {
      return { ...prev, [key]: value }
    })
  }

  const handleFilterDivision = function (divisionId) {
    const teams = getTeamsInDivision(divisionId)

    setTeams(teams)
    setCurrentDivisionId(divisionId)
    setCurrentTeamId(0)
  }

  const getTeamsInDivision = function (divisionId) {
    const unplacedFixtures = stateFixtures.filter(fixture => fixture.weekId === null && fixture.divisionId === divisionId)
    const uniqueTeamLeftIds = lodash.uniq(unplacedFixtures.map(fixture => fixture.teamLeftId))
    const uniqueTeamRightIds = lodash.uniq(unplacedFixtures.map(fixture => fixture.teamRightId))
    const uniqueTeamIds = lodash.uniq([...uniqueTeamLeftIds, ...uniqueTeamRightIds])

    const teamsInDivision = [
      ...uniqueTeamIds.map(teamId => {
        const fixtures = unplacedFixtures.filter(fixture => fixture.teamLeftId === teamId || fixture.teamRightId === teamId)
        return {
          id: teamId,
          name: fixtures[0].teamLeftId === teamId ? fixtures[0].teamLeftName : fixtures[0].teamRightName
        }
      })
    ]

    return teamsInDivision
  }

  const [teams, setTeams] = useState(getTeamsInDivision(currentDivisionId))

  const handleFilterTeam = function (teamId) {
    setCurrentTeamId(teamId)
  }

  const handleDragEnd = function (event) {
    setStateFixtures((prevFixtures) => {
      return prevFixtures.map((fixture) => {
        if (fixture.id === event.active.id) {
          return {
            ...fixture,
            weekId: event.over ? event.over.id : null
          }
        }
        return fixture
      })
    })
  }

  const draggableFixtures = getDraggableFixtures()

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Feedback message={feedbackMessage} />
      <FullLoader isLoading={isLoading} />

      <div className='flex items-center justify-between mb-6 text-sm'>
        <h2 className='text-2xl p-4'>Weeks</h2>
        <div>
          <input
            type='week' name='weekStart' className='border border-stone-300 p-2 m-2 text-sm'
            onChange={(e) => handleChangeWeekRange('start', e.target.value)} value={weekRange.start}
          />
          <span>{stateWeeks.length} total weeks</span>
          <input
            type='week' name='weekEnd' className='border border-stone-300 p-2 m-2 text-sm'
            onChange={(e) => handleChangeWeekRange('end', e.target.value)} value={weekRange.end}
          />
          <button className='bg-primary-500 text-white px-2 py-1' onClick={handleGenerateWeeks}>Generate Weeks
          </button>
          <button className='bg-primary-500 text-white px-2 py-1' onClick={handleRemoveAllWeeks}>Remove All Weeks
          </button>
        </div>
        <button className='bg-primary-500 text-white px-2 py-1' onClick={handleUnplaceAllFixtures}>Unplace all fixtures</button>
        <button className='bg-primary-500 text-white px-2 py-1' onClick={handlePlaceAllFixturesRandomly}>Place all fixtures randomly</button>
        <button className='bg-primary-500 text-white px-2 py-1' onClick={handleSave}>Save</button>
      </div>
      <div className='flex text-sm'>
        <div className='w-1/5'>
          <div className='flex items-center gap-2 mb-2'>
            <select
              name='division' id='division' className='grow border border-stone-300 p-1' value={currentDivisionId}
              onChange={(event) => handleFilterDivision(Number(event.target.value))}
            >
              <option key={0} value={0}>Filter Division</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
            <select
              name='team' id='team' className='grow border border-stone-300 p-1' value={currentTeamId}
              onChange={(event) => handleFilterTeam(Number(event.target.value))}
            >
              <option key={0} value={0}>Filter Team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>

            {/* @todo auto place fixtures */}
            <button className='bg-primary-500 text-white px-2 py-1 hidden' onClick={handleAutoPlaceFixtures}>Auto
              place
            </button>
            <div>
              {draggableFixtures.length}
            </div>
          </div>
          <div className='overflow-y-scroll max-h-[600px]'>
            {draggableFixtures}
          </div>
        </div>
        <div className='flex flex-wrap w-4/5'>

          {stateWeeks.map(week => (
            <div data-week-id={week.id} key={week.id} className='flex flex-col items-center p-1 border border-stone-300'>
              <div>
                {week.dateStart.day(1).format('DD/MM/YYYY')}
              </div>
              <div>
                <select
                  name='weekType' id='weekType' className='border border-stone-300 p-1' value={week.type}
                  onChange={(event) => handleChangeWeekType(week.id, event.target.value)}
                >
                  {Object.entries(WeekTypeLabels).map(([id, label]) => (
                    <option key={id} value={id}>{label}</option>
                  ))}
                </select>
              </div>
              {week.type === WeekTypes.fixture && (
                <>
                  <Droppable week={week}>
                    {droppedFixtureDataByWeekId[week.id].fixtures.map(fixture => (
                      <Draggable key={fixture.id} id={fixture.id}>
                        <div className='border border-stone-300 p-1 rounded'>
                          {fixture.fullName}
                        </div>
                      </Draggable>
                    ))}
                  </Droppable>
                  {droppedFixtureDataByWeekId[week.id].fixturesHidden.length > 0 && (
                    <div>
                      + {droppedFixtureDataByWeekId[week.id].fixturesHidden.length} other fixtures
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

        </div>
      </div>
    </DndContext>
  )
}
