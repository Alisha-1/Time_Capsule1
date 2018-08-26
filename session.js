function hasLoggedIn(api) {
  return function(req, res, next) {
    const sessionId = req.cookies['TIMECAPSULE-SESSIONID']
    if (sessionId) {
      cache.client.get(sessionId, (err, val) => {
        if (err) {
          console.error('Error in login', e)
          if (api) {
            res.json({ error: err })
          } else {
            res.render("404", { error: err.toString() })
          }
        } else {
          if (val) {
            const username = val.toString()
            req.username = username
            next()
          } else {
            if (api) {
              res.json({ error: 'Not logged in' })
            } else {
              res.redirect('/login')
            }
          }
        }
      })
    } else {
      if (api) {
        res.json({ error: 'Not logged in' })
      } else {
        res.redirect('/login')
      }
    }
    
  }
}

module.exports = {
  hasLoggedIn
}