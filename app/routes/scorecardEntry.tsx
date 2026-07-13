import type {Route} from "./+types/_front";
import React, {useState} from 'react'
import {getDbFromContext} from "~/db-context.server";
import {getActiveFulfillmentByPasscode} from "~/repositories/publicFixtureFulfillment.repository.server";
import {useNavigate} from "react-router";
import {buttonPrimaryStyles} from "~/styles/ui-classes";
import DialogBase from "~/components/DialogBase";
import {getFixtureById} from "~/repositories/fixture.repository.server";
import {getCurrentYear} from "~/repositories/year.repository.server";
import {getTeamsByIds} from "~/repositories/team.repository.server";
import {PlayerSelect} from "~/components/admin/fixture/PlayerSelect";
import {
    doublesLabel,
    getDefaultEncounterStruct,
    getDefaultPlayerStruct,
    getPlayerName,
    handleChangeScore
} from "~/components/admin/fixture/ScoreCardForm";
import {getPlayersByYearId} from "~/repositories/player.repository.server";
import {scorecardStructure, SIDE_LEFT, SIDE_RIGHT} from "~/constants/encounter";
import EncounterStatus from "~/constants/EncounterStatus";
import RankChange from "~/components/player/RankChange";

export async function loader({ context, params }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const { passcode } = params
    const currentYear = await getCurrentYear(db)

  const activeFulfillment = await getActiveFulfillmentByPasscode(db, passcode)

    // @todo cache response (this wont change per fulfilment
    const fixture = await getFixtureById(db, currentYear.id, activeFulfillment.fixtureId)
    const teams = await getTeamsByIds(db, currentYear.id, [fixture.teamIdLeft, fixture.teamIdRight])
  const players = await getPlayersByYearId(db, currentYear.id)

  return {
    activeFulfillment,
      fixture,
      teams,
      players
  }
}

export default function ScorecardEntry({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const {
      activeFulfillment,
      fixture,
      teams,
      players
  } = loaderData
  const handleClose = () => navigate('/scorecard');
  const [currentStep, setCurrentStep] = useState(1)
  const [playerStruct, setPlayerStruct] = useState(getDefaultPlayerStruct([]))
  const [encounterStruct, setEncounterStruct] = useState(getDefaultEncounterStruct([]))

  if (activeFulfillment === undefined) return (
    <DialogBase
      open={true}
      onClose={handleClose}
      title="Invalid Passcode"
      actions={
        <button
          className={buttonPrimaryStyles}
          onClick={handleClose}
        >
          Return
        </button>
      }
    >
      The passcode you entered is invalid. Please check the passcode and try again.
    </DialogBase>
  )

  const handleChangePlayer = (structPosition, optionValue) => {
    setPlayerStruct(
      prev => {
        const newStruct = [...prev]
        newStruct[structPosition[0]][structPosition[1]] = optionValue
        return newStruct
      }
    )

    const newEncounterStruct = encounterStruct.map((encounter, index) => {
      let playerIdLeft = playerStruct[0][scorecardStructure[index][0]]
      let playerIdRight = playerStruct[1][scorecardStructure[index][1]]

      if (playerIdLeft === undefined) {
        playerIdLeft = 0
      }
      if (playerIdRight === undefined) {
        playerIdRight = 0
      }

      return {
        ...encounter,
        playerIdLeft,
        playerIdRight,
        status: encounter.status || EncounterStatus.NONE
      }
    })

    setEncounterStruct(newEncounterStruct)
  }

  const handleUpdateFulfillment = async () => {
        // @todo a subtle spinner to indicate storing data

        const response = await fetch("/api/scorecard/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            passcode: activeFulfillment.passcode,
              scorecardData: {
                encounterStruct,
                  playerSignaturesByTeamId: {
                    [fixture.teamIdLeft]: null,
                    [fixture.teamIdRight]: null,
                  }
              }
          })
        });

        const data = await response.json();

        console.log(data);
  }

  const handlePersistPlayers = async () => {
      await handleUpdateFulfillment()
      stepForward()
  }

  const stepForward = () => {
      setCurrentStep(currentStep + 1)
  }

  const handleBeginScoring = (index) => {
      const encounter = encounterStruct[index]

      console.log(encounter)

      stepForward()
  }

  const handleFlipCoin = () => {}

  return (
    <div className={'p-4'}>
        <div>
            <div>
              <span className={buttonPrimaryStyles}>{activeFulfillment.id}</span>

              {/*@todo share button with qr code*/}
              <span className={buttonPrimaryStyles}>{activeFulfillment.passcode}</span>
            </div>
            <div>{'breadcrumbs > here'}</div>
        </div>

        {currentStep === 1 && (
            <>
            <h2>Who is playing?</h2>
            <div>
              <div className='flex gap-4 mb-4'>
                <div className='flex-1'>
                  <PlayerSelect
                    teamId={fixture.teamIdLeft}
                    structPosition={[0, 1]}
                    playerSelectedId={playerStruct[0][1]}
                    handleChangePlayer={handleChangePlayer}
                    players={players}
                    playerStruct={playerStruct}
                  />
                </div>
                <div className='flex-1'>
                  <PlayerSelect
                    teamId={fixture.teamIdRight}
                    structPosition={[1, 1]}
                    playerSelectedId={playerStruct[1][1]}
                    handleChangePlayer={handleChangePlayer}
                    players={players}
                    playerStruct={playerStruct}
                  />
                </div>
              </div>
            </div>
                      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <PlayerSelect
            teamId={fixture.teamLeftId}
            structPosition={[0, 2]}
            playerSelectedId={playerStruct[0][2]}
            handleChangePlayer={handleChangePlayer}
            players={players}
            playerStruct={playerStruct}
          />
        </div>
        <div className='flex-1'>
          <PlayerSelect
            teamId={fixture.teamRightId}
            structPosition={[1, 2]}
            playerSelectedId={playerStruct[1][2]}
            handleChangePlayer={handleChangePlayer}
            players={players}
            playerStruct={playerStruct}
          />
        </div>
      </div>
                      <div className='flex gap-4 mb-4'>
        <div className='flex-1'>
          <PlayerSelect
            teamId={fixture.teamLeftId}
            structPosition={[0, 3]}
            playerSelectedId={playerStruct[0][3]}
            handleChangePlayer={handleChangePlayer}
            players={players}
            playerStruct={playerStruct}
          />
        </div>
        <div className='flex-1'>
          <PlayerSelect
            teamId={fixture.teamRightId}
            structPosition={[1, 3]}
            playerSelectedId={playerStruct[1][3]}
            handleChangePlayer={handleChangePlayer}
            players={players}
            playerStruct={playerStruct}
          />
        </div>
      </div>
                <button className={buttonPrimaryStyles} onClick={handlePersistPlayers}>Continue</button>
            </>
        )}
        {currentStep === 2 && (
            <div>
                <h2>scorecard</h2>

                      {scorecardStructure.map((encounterRow, index) => (

                        // if index does not exist then skip

                          <div>
                        <div key={index} className='flex gap-4 mb-4'>
                          <div className='flex flex-1 items-center'>
                            <div className='flex-1 flex justify-end'>
                              <label>
                                {encounterRow[0] === EncounterStatus.DOUBLES ? doublesLabel : getPlayerName(players, playerStruct[0][encounterRow[0]])}
                                <RankChange rankChange={encounterStruct[index].playerRankChangeLeft} />
                                <input
                                  className='border border-tertiary-500 rounded w-14 text-center text-2xl ml-4 py-1'
                                  type='text'
                                  value={encounterStruct[index].scoreLeft}
                                  onChange={() => {}}
                                  onKeyUp={(e) => handleChangeScore(e, index, SIDE_LEFT, encounterStruct[index], encounterStruct, setEncounterStruct)}
                                />
                              </label>
                            </div>
                          </div>
                          <div className='flex-1'>
                            <label>
                              <input
                                className='border border-tertiary-500 rounded w-14 text-center text-2xl mr-4 py-1'
                                type='text'
                                value={encounterStruct[index].scoreRight}
                                onChange={() => {}}
                                onKeyUp={(e) => handleChangeScore(e, index, SIDE_RIGHT, encounterStruct[index], encounterStruct, setEncounterStruct)}
                              />
                              <RankChange rankChange={encounterStruct[index].playerRankChangeRight} />
                              {encounterRow[0] === EncounterStatus.DOUBLES ? doublesLabel : getPlayerName(players, playerStruct[1][encounterRow[1]])}
                            </label>
                          </div>
                        </div>
                              <button className={buttonPrimaryStyles} onClick={() => handleBeginScoring(index)}>Score</button>
                          </div>
                      ))}
            </div>
        )}
        {currentStep === 3 && (
            <div>
                <div class="relative w-32 h-32 [transform-style:preserve-3d] animate-coin-flip-idle">
  <div class="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold text-white [backface-visibility:hidden] bg-yellow-400">
    H
  </div>

  <div class="absolute inset-0 rounded-full flex items-center justify-center text-4xl font-bold text-white [backface-visibility:hidden] bg-blue-500 [transform:rotateY(180deg)]">
    T
  </div>
</div>

                <h2>Flip a coin!</h2>
                              <button className={buttonPrimaryStyles} onClick={handleFlipCoin}>Flip!</button>
            </div>
        )}

    </div>
  )
}
