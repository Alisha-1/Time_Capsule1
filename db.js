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
  let err = null
  const result = await client.query(`SELECT ID, EMAIL FROM USERS WHERE EMAIL = '${username}'`)

  if (result) {
    if (result.rows[0]) {
      err = "User already exists"
    } else {
      await client.query(`INSERT INTO USERS (EMAIL, PASSWORD, NAME) VALUES ('${username}', '${password}', '${name}')`)
    }
  }

  client.release()
  return err
}

module.exports = {
  connect,
  checkLogin,
  createUser
}
