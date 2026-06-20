import { sql } from "drizzle-orm";

export async function getUserById (db, id) {
  const users = await db.all(sql`
  select * from user 
           where id = ${id}
  `)
    return users[0]
}

export async function getUserByEmail (db, email) {
    const users = await db.all(sql`
      SELECT id, email, password
      FROM user
      WHERE email = ${email}
  `)
    return users[0]
}

export async function updateUserPassword (db, id, hashedPassword) {
    const result = await db.run(sql`
    UPDATE user
    SET password = ${hashedPassword}
    WHERE id = ${id}
    `)
     return result.rowsAffected;
}
