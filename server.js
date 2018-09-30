var express = require("express");
var app = express();
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var fs = require("fs");
var passwordHash = require("password-hash");
var GoogleSignIn = require("google-sign-in");
const { google } = require("googleapis");
// var project = new GoogleSignIn.Project(
//   "531816459848-26tnvqqaff0ieedn4dp4f2hii3fq1b6m.apps.googleusercontent.com"
// );


AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = "us-east-1";

var BASE_S3_URL = "https://s3.amazonaws.com/timecapsule-alisha";

var bodyParser = require("body-parser");
const db = require("./db");
//const cache = require('./cache')

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);

app.use(express.static(__dirname + "/app/styles"));
app.use(express.static(__dirname + "/app/Images"));
app.use(express.static(__dirname + "/app"));



app.post("/login", async (req, res) => {
  try {
    // Search DB and compare passwords
    const user = await db.checkLogin(req.body.username, req.body.password);

    // Send user data back to the client
    res.json(user);
  } catch (e) {
    console.error("Error in login", e);
    res.json({
      error: e.toString()
    });
  }
});

// app.post("/googlelogin", async (req, res) => {

//     project.verifyToken("token").then(
//       jsonData => {
//           res.json(JSON.stringify(jsonData));
//       },
//       error => {
//         res.json({
//           error: 'error'
//         });// Logs 'Invalid Value'
//       }
//     );

//   });

app.post("/register", async (req, res) => {
  //Store the request variables filled by user into new variable
  const username = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const password2 = req.body.password2;

  try {
    if (password != password2) {
      res.json({
        error: "Password does not match"
      });
    } else {
       //const hashedPassword;
      const hashedPassword = passwordHash.generate(password); //hashing
      const user = await db.createUser(username, hashedPassword, name);
      res.json({
        user
      });
    }
  } catch (e) {
    console.error("Error in login", e);
    res.json({
      error: e.toString()
    });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  let userId = req.body.userId ? "anon" : req.body.userId;

  console.log("/upload", req.file);
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      console.error(err);
      res.json({
        error: err
      });
    } else {
      var base64data = new Buffer(data, "binary");
      //Store image in AWS 
      s3.putObject(
        {
          Bucket: "timecapsule-alisha",
          Key: `${userId}/${req.file.originalname}`,
          Body: base64data,
          ACL: "public-read"
        },

        (err, resp) => {
          if (err) {
            console.error(err);
          }
          console.log("Successfully uploaded package.");
          res.json({
            error: err,
            result: Object.assign({}, resp, {
              fileName: `${BASE_S3_URL}/${userId}/${req.file.originalname}`
            })
          });
        }
      );
    }
  });
});

app.post("/capsule", async (req, res) => {
  try {
    console.log("Capsule POST with", req.body);
    const capsuleId = await db.createCapsule(req.body);

    res.json({
      capsuleId: capsuleId
    });
  } catch (e) {
    console.error(e);
    res.json({
      error: e
    });
  }
});

app.post("/event_uploadMore",async(req, res) =>{
  console.log(req.body);
  try {
    const capsuleId = await db.event_uploadMore(req.body);

    res.json({
      capsuleId: capsuleId
    });
  } catch (e) {
    console.error(e);
    res.json({
      error: e
    });
  }
});

app.patch("/capsule", async (req, res) => {
  try {
    console.log("Capsule PATCH with", req.body);
    const capsuleId = await db.updateCapsule(req.body);

    res.json({
      capsuleId: capsuleId
    });
  } catch (e) {
    console.error(e);
    res.json({
      error: e
    });
  }
});

app.get("/user/:userId/capsules", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("/user/:userId/capsules", req.params);
    const capsules = await db.getCapsulesForUser(userId);

    res.json({
      result: capsules
    });
  } catch (e) {
    console.error(e);
    res.json({
      error: e
    });
  }
});

app.get("/capsule/:capsuleId", async (req, res) => {
  try {
    const capsuleId = req.params.capsuleId;
    console.log("In route /capsule/:capsuleId", capsuleId);
    const data = await db.getCapsule(capsuleId);

    res.json({
      result: data
    });
  } catch (e) {
    console.error(e);
    res.json({
      error: e
    });
  }
});

app.get("*", function(req, res) {
  if (req.path == "/") {
    res.sendFile(__dirname + "/" + "index.html");
  } else {
    res.sendFile(__dirname + req.path);
  }
});

async function start() {
  try {
    await db.connect();

    var server = app.listen(process.env.PORT || 5000, () => {
      var host = server.address().address;
      var port = server.address().port;
      console.log("Example app listening at http://%s:%s", host, port);
    });
  } catch (e) {
    console.error(e);
  }
}


// app.get("/gurl", function(req, res) {
//   res.send(url);
// });

// app.get("/token", function(req, res) {
//   var code = req.query.code;
//   oauth2Client.getToken(code, function(err, tokens) {
//     oauth2Client.setCredentials(tokens);
//     res.send(tokens);
//   });
// });

app.get("/gurl", async(req, res) =>{
  res.send(url);
});

app.get("/token", async (req, res) =>{
  var code = req.query.code;
  oauth2Client.getToken(code, function(err, tokens) {
    oauth2Client.setCredentials(tokens);
    res.send(tokens);
  });
});

//Google sign in

const oauth2Client = new google.auth.OAuth2(
  // "538032522253-gp3nmii7d59jka3ub4p6urtoj3kt2c46.apps.googleusercontent.com",
  // "pP816EXr_M-FgeVsBg39V9i3",
  // "https://mytimecapsule.herokuapp.com/#/MyCapsule"
  "577425348964-3oonc4njvh3396sb1riet3vc5khb0hsn.apps.googleusercontent.com",
  "sGvFgM7USR7tmpdc6jWeN-c4",
  "http://localhost:8080/oauthcallback"

);

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

const url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: "offline",

  // If you only need one scope you can pass it as a string
  scope: scopes
});



start();
