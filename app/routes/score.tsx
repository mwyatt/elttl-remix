import type {Route} from "./+types/score";
import React, {Suspense, useState} from 'react'
import {getCurrentYear} from "~/repositories/year.repository.server";
import {getDbFromContext} from "~/db-context.server";
import CreatableSelect from "react-select/creatable";
import {getUnfulfilledFixtures} from "~/repositories/fixture.repository.server";
import {buttonPrimaryStyles} from "~/styles/ui-classes";
import {getActivePublicFulfillments} from "~/repositories/publicFixtureFulfillment.repository.server";
import {StatusCodes} from "http-status-codes";
import {useNavigate} from "react-router";
import DialogBase from "~/components/DialogBase";

export async function loader({ context }: Route.LoaderArgs) {
  const db = getDbFromContext(context);
  const currentYear = await getCurrentYear(db);

  const unfulfilledFixtures = await getUnfulfilledFixtures(db, currentYear.id)
  const activePublicFulfillments = await getActivePublicFulfillments(db)

  return {
    unfulfilledFixtures,
    activePublicFulfillments
  }
}

export default function Score({ loaderData }: Route.ComponentProps<typeof loader>) {
  const navigate = useNavigate();
  const {
      unfulfilledFixtures,
    activePublicFulfillments
  } = loaderData
  const [chosenFixture, setChosenFixture] = useState(null)
  const [alreadyScoringIsOpen, setAlreadyScoringIsOpen] = useState(false)
  const [serverErrorIsOpen, setServerErrorIsOpen] = useState(false)

  const fixtureSelectOptions = unfulfilledFixtures.map(fixture => ({
    value: fixture.id,
    label: `${fixture.teamLeftName} vs ${fixture.teamRightName}`
  }))

  const handleChangeFixture =  (fixtureId) => {
  const fixture = unfulfilledFixtures.find(fixture => fixture.id === fixtureId)
    setChosenFixture(fixture)
  }

  const handleBeginScoring = async () => {
    if (!chosenFixture) return

    const fixture = unfulfilledFixtures.find(fixture => fixture.id === chosenFixture.id)

    try {

    const response = await fetch(`/api/score/start?fixture-id=${fixture.id}`)
    const data = await response.json()
      if (response.status === StatusCodes.CONFLICT) {
        setAlreadyScoringIsOpen(true)
      }

      // we should get the passcode and use it to redirect the user to the scorecard fulfillment area
      // this can be the same entrypoint which is used when a user joins the session too
      navigate(`/scorecard/${data.activeFulfillment.passcode}`);
    } catch (error) {
        setServerErrorIsOpen(true)
    }
  }

  const handleCloseAlreadingScoringIsOpen = () => setAlreadyScoringIsOpen(false);
  const handleCloseServerError = () => setServerErrorIsOpen(false);

  return (
    <div className={'p-4'}>
                                  <DialogBase
              open={serverErrorIsOpen}
              onClose={handleCloseServerError}
              title="Error starting scoring session"
              actions={
                <button
                  className={buttonPrimaryStyles.join(' ')}
                  onClick={handleCloseServerError}
                >
                  Close
                </button>
              }
            >
              Error starting scoring session
            </DialogBase>

                  <DialogBase
              open={alreadyScoringIsOpen}
              onClose={handleCloseAlreadingScoringIsOpen}
              title="Already Scoring"
              actions={
                <button
                  className={buttonPrimaryStyles.join(' ')}
                  onClick={handleCloseAlreadingScoringIsOpen}
                >
                  Close
                </button>
              }
            >
              This fixture is already being scored, find out who started and join in!
            </DialogBase>

      <h1 className={'text-2xl text-center'}>Fulfil Fixture</h1>
        <div className={'sm:flex justify-center'}>
      <div className={'border-b-2 border-stone-200 pb-6 mb-4'}>
        <h2 className={'text-2xl font-bold mb-4 mt-2 text-center'}>Select a Fixture</h2>
        <Suspense fallback={<div>Loading…</div>}>
        <CreatableSelect
        isValidNewOption={() => false}
        className='text-lg my-4'
        options={fixtureSelectOptions}
        onChange={option => handleChangeFixture(option.value)}
        />
        </Suspense>
          {!!chosenFixture && (
              <>
              <p>{chosenFixture.teamLeftName} are playing at home and {chosenFixture.teamRightName} are away</p>
            <button className={buttonPrimaryStyles.join(' ')} onClick={handleBeginScoring}>Begin Scoring</button>
            </>
          )}
      </div>
      <div>
        <h2 className={'text-2xl font-bold mb-4 mt-2 text-center'}>Join others scoring</h2>
          <p>There are {activePublicFulfillments.length} other fixtures being fulfilled currently.</p>
        <p>Get the passcode from someone already scoring and join</p>
        <input
            type="password"
            className={'rounded px-3 py-2 font-bold capitalize text-4xl text-center focus:outline-2 focus:outline-offset-2 focus:outline-stone-500 active:border-stone-700 border-stone-500 border w-full my-4'}
            placeholder="Enter passcode"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/scorecard/${passcode}`)
              }
            }}
            onChange={(e) => {
              const passcode = e.target.value
              console.log(passcode)
            }}
        />
        <button className={buttonPrimaryStyles.join(' ')} onClick={() => navigate(`/scorecard/${passcode}`)}>Join</button>
      </div>
        </div>
    </div>
  )
}
