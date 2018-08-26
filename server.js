var express = require('express');
var app = express();

var bodyParser = require('body-parser')
const db = require('./db')
//const cache = require('./cache')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/app/styles'));
app.use(express.static(__dirname + '/app/Images'));


// // const { Client } = require('pg');
// var pg = require("pg");

// const connection = process.env.DATABASE_URL || 'postgres://femodzrnsqafnc:7e9011a13dc74d0ac54ac3776ebcea139197010fed339cc9f57686a16f5daf43@ec2-54-247-123-231.eu-west-1.compute.amazonaws.com:5432/d71aserb3ek998';

// var client = new pg.Client({
//     user: "femodzrnsqafnc",
//     password: "7e9011a13dc74d0ac54ac3776ebcea139197010fed339cc9f57686a16f5daf43",
//     database: "d71aserb3ek998",
//     port: 5432,
//     host: "ec2-54-247-123-231.eu-west-1.compute.amazonaws.com",
//     ssl: true
//   });

// client.connect();

app.get('*', function (req, res) {
    console.log(req.path);
   var path = req.path;
   if(req.path == '/'){
     res.sendFile( __dirname + "/" + "index.html" );
   }else
   {
     res.sendFile( __dirname + req.path);
   }
});

app.post('/app',function (req, res) {
})

app.post('/login', async (req, res) => {
  try {
    const user = await db.checkLogin(req.body.username, req.body.password)
    res.json(user)
  } catch(e) {
    console.error('Error in login', e)
    res.json({
      error: e.toString()
    })
  }
})

// app.post('/register', async (req, res) => {
//   const username = req.body.username
//   const name = req.body.name
//   const password = req.body.password
//   const password2 = req.body.password2

//   if (password != password2) {
//     res.render("404", { error: 'Password does not match' })
//   } else {
//     const err = await db.createUser(username, password, name)
//     if (!err) {
//       await cache.createSession(res, username)
//       res.json({

//       })
//     } else {
//       console.error('Error in login', err)
//       res.render("404", { error: err.toString() })
//     }
//   }
// })

async function start() {
  try {
    await db.connect()

    var server = app.listen(process.env.PORT || 5000, () => {
      var host = server.address().address
      var port = server.address().port
      console.log("Example app listening at http://%s:%s", host, port)
    })
  } catch(e) {
    console.error(e)
  }
}

start()
