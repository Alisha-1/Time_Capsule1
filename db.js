const { Pool } = require('pg')
const { parse } = require('pg-connection-string')
var passwordHash = require('password-hash');

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
          var login = passwordHash.verify(password, result.rows[0].Password);

          if (login) {
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

async function createUser(username, password, name,normalpassowrd) {
  const client = await connect()

  // Checks to see if the user already exists
  const result = await client.query(`SELECT "UserID", "Email" FROM "Users" WHERE "Email" = '${username}'`)

  if (result) {
    if (result.rows[0]) {
      throw("User already exists")
    } else {
      // Create record in Database
      await client.query(`INSERT INTO "Users" ("Email", "Password", "Name") VALUES ('${username}', '${password}', '${name}')`)
      return await checkLogin(username, normalpassowrd)
    }
  }

  client.release()
}



async function event_uploadMore({images,capsuleId}) {
  const client = await connect()
  images.forEach(async image => {
    await client.query(`INSERT INTO "Content" ("CapsuleID", "Description", "URL") VALUES ('${capsuleId}', '${image.description}', '${image.fileName}')`)
})
 return capsuleId

}

async function createCapsule({ images, date, recipient, userId, name, description, coverImage }) {
  const client = await connect()
  const result = await client.query(`INSERT INTO "Time_Capsule" ("UserID", "Recieved_Date", name, description, coverphoto) VALUES ('${userId}', '${date}', '${name}', '${description}', '${coverImage}') RETURNING *`)
  const capsuleId = result.rows[0].CapsuleID
  await client.query(`INSERT INTO "Time_Capsule-Recipient" ("CapsuleID", "Recipient_Email") VALUES ('${capsuleId}', '${recipient}')`)

  images.forEach(async image => {
    await client.query(`INSERT INTO "Content" ("CapsuleID", "Description", "URL") VALUES ('${capsuleId}', '${image.description}', '${image.fileName}')`)
  })

  return capsuleId
}

async function updateCapsule({ capsuleId, closeDate }) {
  const client = await connect()
  const result = await client.query(`UPDATE "Time_Capsule" SET closedate = '${closeDate}' WHERE "CapsuleID" = '${capsuleId}'`)
  return result
}

async function getCapsulesForUser(userId) {
  const client = await connect()
  const result = await client.query(`SELECT * FROM "Time_Capsule" WHERE "UserID" = '${userId}'`)
  return result.rows
}

async function getCapsule(capsuleId) {
  const client = await connect()
  const tc = await client.query(`SELECT * FROM "Time_Capsule", "Users" WHERE "Time_Capsule"."CapsuleID" = ${capsuleId} AND  "Time_Capsule"."UserID" = "Users"."UserID"`)
  const images = await client.query(`SELECT * FROM "Content" WHERE "CapsuleID" = ${capsuleId}`)

  //result is an object
  let result = tc.rows[0]
  //Add "images" property to result as array of rows. Images: image1, image2, image2
  result['images'] = images.rows
  return result
}

module.exports = {
  connect,
  checkLogin,
  createUser,
  createCapsule,
  updateCapsule,
  getCapsulesForUser,
  event_uploadMore,
  getCapsule
}
