const { Pool } = require('pg')
const { parse } = require('pg-connection-string')

const pool = new Pool(
  parse(process.env.DATABASE_URL || 'postgres://femodzrnsqafnc:7e9011a13dc74d0ac54ac3776ebcea139197010fed339cc9f57686a16f5daf43@ec2-54-247-123-231.eu-west-1.compute.amazonaws.com:5432/d71aserb3ek998?ssl=true' || 'postgres://localhost:5432/timecapsule')
)

async function connect() {
  return await pool.connect()
}

async function checkLogin(username, password) {

  let err 

  try {
    const client = await connect()
    const result = await client.query(`SELECT "UserID", "Name", "Email", "Password" FROM "Users" WHERE "Email" = '${username}'`)
    if (result) {
      if (result.rows) {
        if (result.rows[0]) {
          if (result.rows[0].Password == password) {
            console.log('Login completed')
            if (client)
              client.release()
            return result.rows[0]
          } else {
            throw('Cannot log in')
          }
        } else {
          throw('Cannot log in')
        }
      } else {
        throw('Cannot log in')
      }
    } else {
      throw('Cannot log in')
    }
  } catch(e) {
    throw(e);
  }
}

async function createUser(username, password, name) {
  const client = await connect()

  // Checks to see if the user already exists
  const result = await client.query(`SELECT "UserID", "Email" FROM "Users" WHERE "Email" = '${username}'`)

  if (result) {
    if (result.rows[0]) {
      throw("User already exists")
    } else {
      // Create record in Database
      await client.query(`INSERT INTO "Users" ("Email", "Password", "Name") VALUES ('${username}', '${password}', '${name}')`)
      return await checkLogin(username, password)
    }
  }

  client.release()
}

async function createCapsule({ images, date, recipient, userId }) {
  const client = await connect()
  const result = await client.query(`INSERT INTO "Time_Capsule" ("UserID", "Recieved_Date") VALUES ('${userId}', '${date}') RETURNING *`)
  const capsuleId = result.rows[0].CapsuleID
  await client.query(`INSERT INTO "Time_Capsule-Recipient" ("CapsuleID", "Recipient_Email") VALUES ('${capsuleId}', '${recipient}')`)

  images.forEach(async image => {
    await client.query(`INSERT INTO "Content" ("CapsuleID", "Description", "URL") VALUES ('${capsuleId}', '${image.description}', '${image.fileName}')`)
  })

  return capsuleId
}

module.exports = {
  connect,
  checkLogin,
  createUser,
  createCapsule
}
