import {sql} from "drizzle-orm";
import dayjs from "dayjs";

export async function getActivePublicFulfillments (db) {
  return await db.all(`
      select 
          id,
          fixtureId,
          timeStarted,
          timeCompleted
      from publicFixtureFulfilment  
      where timeCompleted is null
  `)
}

export async function getActiveFulfillmentByPasscode (db, passcode) {
  const rows = await db.all(`
      select 
          id,
          fixtureId,
          passcode
      from publicFixtureFulfilment  
      where passcode = ${passcode}
  `)
    return rows[0]
}

// @todo add ip and user agent
export async function startActiveFulfillment (db, fixtureId) {
    const passcode = Math.floor(1000 + Math.random() * 9000)

    const response = await db.run(sql`
    INSERT INTO publicFixtureFulfilment (
         fixtureId,
         passcode,
         timeStarted
    )
      VALUES (
        ${fixtureId},
        ${passcode},
        ${dayjs().unix()}
      )`<any>);

    return {
        id: Number(response.lastInsertRowid),
        passcode
    };
}
