
// var express = require('express');
// var app = express();
// var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });
// var AWS = require('aws-sdk')
// var s3 = new AWS.S3()
// var fs = require('fs')
// const cryptography = require('cryptography');
// cryptography.defaults.key = "password";
// cryptography.defaults.encryptionAlgorithm = "aes192";
// cryptography.defaults.encoding = "hex";

// var BASE_S3_URL = 'https://s3.amazonaws.com/timecapsule-alisha'

// var bodyParser = require('body-parser')
// const db = require('./db')
// //const cache = require('./cache')

// app.use( bodyParser.json() );       // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
//   extended: true
// }));

// app.use(express.static(__dirname + '/app/styles'));
// app.use(express.static(__dirname + '/app/Images'));

// app.post('/login', async (req, res) => {
//   try {

//     // Search DB and compare passwords
//     const user = await db.checkLogin(req.body.username, req.body.password)

//     // Send user data back to the client
//     res.json(user)
//   } catch(e) {
//     console.error('Error in login', e)
//     res.json({
//       error: e.toString()
//     })
//   } 

// app.post('/register', async (req, res)=> {
//   const username = req.body.email
//   const name = req.body.name
//   const password = req.body.password
//   const password2 = req.body.password2

//   try {
//     if (password != password2) {
//       res.json({
//         error: 'Password does not match'
//       })
//     } else { 

//       cryptography.encrypt({
//         data: password
//       }).then(async function (encryptedValue) {

//         const user = await db.createUser(username, password, name)
//         res.json({
//           user
//         })

//       })   
//     }
//   } catch(e) {
//     console.error('Error in login', e)
//     res.json({
//       error: e.toString()
//     })
//   }
// })

// app.post('/upload', upload.single('file'), (req, res) => {

//   let userId = req.body.userId ? 'anon' : req.body.userId

//   console.log('/upload', req.file)
//   fs.readFile(req.file.path, (err, data) => {
//     if (err) { 
//       console.error(err)
//       res.json({
//         error: err
//       })
//     } else {
//       var base64data = new Buffer(data, 'binary');

//       s3.putObject({
//         Bucket: 'timecapsule-alisha',
//         Key: `${userId}/${req.file.originalname}`,
//         Body: base64data,
//         ACL: 'public-read'
//       }, (err, resp) => {
//         if (err) {
//           console.error(err)
//         }
//         console.log('Successfully uploaded package.');
//         res.json({
//           error: err,
//           result: Object.assign({}, resp, { fileName: `${BASE_S3_URL}/${userId}/${req.file.originalname}` })
//         })
//       });
//     }
//   })
  
// })

// app.post('/capsule', async (req, res) => {
//   try {
//     console.log('Capsule POST with', req.body)
//     const capsuleId = await db.createCapsule(req.body)
    
//     res.json({
//       capsuleId: capsuleId
//     })
//   } catch(e) {
//     console.error(e)
//     res.json({
//       error: e
//     })
//   }
// })

// app.patch('/capsule', async (req, res) => {
//   try {
//     console.log('Capsule PATCH with', req.body)
//     const capsuleId = await db.updateCapsule(req.body)
    
//     res.json({
//       capsuleId: capsuleId
//     })
//   } catch(e) {
//     console.error(e)
//     res.json({
//       error: e
//     })
//   }
// })

// app.get('/user/:userId/capsules', async (req, res) => {
//   try {
//     const userId = req.params.userId
//     console.log('/user/:userId/capsules', req.params)
//     const capsules = await db.getCapsulesForUser(userId)
    
//     res.json({
//       result: capsules
//     })
//   } catch(e) {
//     console.error(e)
//     res.json({
//       error: e
//     })
//   }
// })

// app.get('/capsule/:capsuleId', async (req, res) => {
//   try {
//     const capsuleId = req.params.capsuleId
//     console.log('In route /capsule/:capsuleId', capsuleId)
//     const data = await db.getCapsule(capsuleId)
    
//     res.json({
//       result: data
//     })
//   } catch(e) {
//     console.error(e)
//     res.json({
//       error: e
//     })
//   }
// })

// app.get('*', function (req, res) {
//   if(req.path == '/'){
//     res.sendFile( __dirname + "/" + "index.html" );
//   }else
//   {
//     res.sendFile( __dirname + req.path);
//   }
// });

// async function start() {
//   try {
//     await db.connect()

//     var server = app.listen(process.env.PORT || 5000, () => {
//       var host = server.address().address
//       var port = server.address().port
//       console.log("Example app listening at http://%s:%s", host, port)
//     })
//   } catch(e) {
//     console.error(e)
//   }
// }

// start()
// }