'use client'

import dynamic from 'next/dynamic'
import { SIDE_LEFT, SIDE_RIGHT } from '@/constants/encounter'
import { getHandicap, getStartValue } from '@/constants/Handicap'
import { useMemo, useState } from 'react'
const CreatableSelect = dynamic(() => import('react-select/creatable'), { ssr: false })

export default function HandicapCalculator ({ players }) {
  const [chosenPlayers, setChosenPlayers] = useState({})

  const options = players.map(player => ({
    value: player.id,
    label: player.name + ` (${player.rank})`
  }))

  const handicapInformation = useMemo(() => {
    if (chosenPlayers[SIDE_LEFT] === undefined || chosenPlayers[SIDE_RIGHT] === undefined) {
      return
    }

    const rankLeft = chosenPlayers[SIDE_LEFT].rank
    const rankRight = chosenPlayers[SIDE_RIGHT].rank

    const handicapLeft = getHandicap(rankLeft, rankRight)
    const handicapRight = getHandicap(rankRight, rankLeft)

    const handicapDiff = Math.abs(handicapLeft - handicapRight)

    const disadvantagedPlayer = handicapLeft > handicapRight ? chosenPlayers[SIDE_LEFT] : chosenPlayers[SIDE_RIGHT]

    const startValue = getStartValue(handicapDiff)

    return {
      [SIDE_LEFT]: handicapLeft,
      [SIDE_RIGHT]: handicapRight,
      handicapDiff,
      disadvantagedPlayer,
      startValue
    }
  }, [chosenPlayers])

  const handleChangePlayer = (side, playerId) => {
    const player = players.find(p => p.id === playerId)

    setChosenPlayers({ ...chosenPlayers, [side]: player })
  }

  return (
    <>
      <div className='flex gap-6 mb-4 mt-8 flex-col sm:flex-row'>
        <div className='basis-1/2'>
          <CreatableSelect
            isValidNewOption={() => false}
            className='text-lg'
            options={options}
            onChange={option => handleChangePlayer(SIDE_LEFT, option.value)}
          />
          {handicapInformation && (
            <div className='text-lg pt-4 text-center'>
              <p>Handicap: {handicapInformation[SIDE_LEFT]}</p>
            </div>
          )}
        </div>
        <div className='basis-1/2'>
          <CreatableSelect
            isValidNewOption={() => false}
            className='text-lg'
            options={options}
            onChange={option => handleChangePlayer(SIDE_RIGHT, option.value)}
          />
          {handicapInformation && (
            <div className='text-lg pt-4 text-center'>
              <p>Handicap: {handicapInformation[SIDE_RIGHT]}</p>
            </div>
          )}
        </div>
      </div>
      {handicapInformation && (
        <>
          <div className='p-4 mt48 border-t text-lg text-center'>
            Difference: {handicapInformation.handicapDiff}
          </div>
          <div className='p-4 mt-2 border rounded bg-primary-500 text-white text-2xl text-center'>
            {handicapInformation.startValue > 0 && (
              <p>
                <strong>{handicapInformation.disadvantagedPlayer.name}</strong> starts with <strong className='border-b-white border-b-2'>{handicapInformation.startValue}</strong>
              </p>
            )}
            {handicapInformation.startValue === 0 && (
              <p>
                <strong>Both players</strong> start on <strong>0</strong>
              </p>
            )}
          </div>
        </>
      )}
    </>
  )
}
