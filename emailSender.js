const CAPSULE_URL = process.env.CAPSULE_URL
const POLLING_TIME = 3 * 60 * 1000 // 5 mins
//const RUN_TIME = 60 * 60 * 1000 // 1 Hour
const nodemailer = require('nodemailer')
const { Pool } = require('pg')
const { parse } = require('pg-connection-string')

const pool = new Pool(
  parse(process.env.DATABASE_URL)
)

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
})

// Check after every 5 mins if any reciepient is ready
console.log(`Waiting for ${POLLING_TIME / 60 / 1000} minutes`)
setInterval(async () => {
  await run()
}, POLLING_TIME)

//run()

async function run() {
  try {

    // First Connect to the database
    console.log('Connecting to database')
    const client = await pool.connect()

    // Query Database to find if its time to run. This is done so that we can track when the job was last run
    console.log('Querying database to check last run')
    const result = await client.query('SELECT LAST_RUN FROM EMAIL_JOB ORDER BY LAST_RUN DESC')

    // If Error then exit
    if (!result.rows) {
      return
    }

//     if (result.rows.length > 0) {
//       // If we've run before the run time then stop
//       console.log('Time now', Date.now())
//       console.log('Last Run', Date.now() - result.rows[0].last_run)
//       if (Date.now() - result.rows[0].last_run <= RUN_TIME) {
//         return
//       }
//     }

    // Run a query to check which recipients I need to send a message to. Check with the sent field in the table
    const recipientsToSendTo = await client.query('SELECT tc."CapsuleID", tc."Recieved_Date", tr."Recipient_Email" FROM "Time_Capsule" tc INNER JOIN "Time_Capsule-Recipient" tr ON tc."CapsuleID" = tr."CapsuleID" WHERE (tr.Sent="false" AND tc."Recieved_Date" <= NOW()) ')
    console.log('Found ${recipientsToSendTo.rows.length} recipients')
    recipientsToSendTo.rows.forEach(async (rec) => {
      // Send emails to all recipients
      await sendEmail(rec.Recipient_Email, rec.CapsuleID)
    })

    // Update Sent flag on all records
    await client.query('UPDATE "Time_Capsule-Recipient" SET Sent = "true" FROM (SELECT tc."CapsuleID", tc."Recieved_Date", tr."Recipient_Email" FROM "Time_Capsule" tc INNER JOIN "Time_Capsule-Recipient" tr ON tc."CapsuleID" = tr."CapsuleID" WHERE ( tr.Sent="false" AND tc."Recieved_Date" <= NOW())) ')

    // Once the run is complete then insert job record
    await client.query('INSERT INTO EMAIL_JOB (LAST_RUN) VALUES (NOW())')

    //client.close()
  } catch(e) {
    console.error(e)
  }
}

//run()

function sendEmail(emailAddress, capsuleId) {

  const mailOptions = {
    from: 'Timecapsule <' + process.env.GMAIL_USER + '>', // sender address
    to: emailAddress, // list of receivers
    subject: 'Your timecapsule is ready', // Subject line
    text: `Click here to access your time capsule ${CAPSULE_URL}/${capsuleId}`, // plaintext body
  };
  
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        console.error('Error sending email', error)
        reject()
      } else {
        console.log('Email message sent')
        resolve()
      }
    });
  })
}
