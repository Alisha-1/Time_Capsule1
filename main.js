const express = require('express')
const app = express()
const db = require('./db')
const cache = require('./cache')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const mustacheExpress = require('mustache-express')

app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/Main_Home.html`)
})

app.get('/login', (req, res) => {
  res.sendFile(`${__dirname}/public/Login.html`)
})

app.get('/signup', (req, res) => {
  res.render(`Sign_Up`)
})

app.get('/home', hasLoggedIn(), (req, res) => {
  res.render('HomeLogin')
})

app.get('/create', hasLoggedIn(), (req, res) => {
  res.render('Create')
})

app.get('/logout', hasLoggedIn(), (req, res) => {
  const sessionId = req.cookies['TIMECAPSULE-SESSIONID']
  cache.del(sessionId)
  res.clearCookie('TIMECAPSULE-SESSIONID')
  res.redirect('/')
})

app.post('/login', async (req, res) => {

  try {
    const [err, id, username] = await db.checkLogin(req.body.username, req.body.password)
    if (id) {
      await cache.createSession(res, username)
      // Set cache and cookie
      res.redirect('/home')
    } else {
      console.error('Error in login', err)
      res.render("404", { error: err.toString() })
    }
  } catch(e) {
    console.error('Error in login', e)
    res.render("404", { error: e.toString() })
  }
})

app.post('/signup', async (req, res) => {
  const username = req.body.username
  const name = req.body.name
  const password = req.body.password
  const password2 = req.body.password2

  if (password != password2) {
    res.render("404", { error: 'Password does not match' })
  } else {
    const err = await db.createUser(username, password, name)
    if (!err) {
      await cache.createSession(res, username)
      res.redirect('/home')
    } else {
      console.error('Error in login', err)
      res.render("404", { error: err.toString() })
    }
  }
})

async function start() {
  try {
    await db.connect()

    app.listen(process.env.PORT || 5000, () => {
      console.log('Server started')
    })
  } catch(e) {
    console.error(e)
  }
}

start()
