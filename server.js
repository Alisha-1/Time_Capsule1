var express = require('express');
var app = express();
const queries = require('./test');


// var fpath = require('path');
// var MongoClient = require('mongodb').MongoClient;
var mongoose = require("mongoose");
// console.log(mongoose);
var morgan = require("morgan");

// var exfileUpload = require('express-fileupload');
// app.use(exfileUpload());


var fs   = require("fs");
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use(express.static(__dirname + '/app/styles'));
app.use(express.static(__dirname + '/app/Images'));


// const { Client } = require('pg');
var pg = require("pg");

const connection = process.env.DATABASE_URL || 'postgres://femodzrnsqafnc:7e9011a13dc74d0ac54ac3776ebcea139197010fed339cc9f57686a16f5daf43@ec2-54-247-123-231.eu-west-1.compute.amazonaws.com:5432/d71aserb3ek998';


var client = new pg.Client({
    user: "femodzrnsqafnc",
    password: "7e9011a13dc74d0ac54ac3776ebcea139197010fed339cc9f57686a16f5daf43",
    database: "d71aserb3ek998",
    port: 5432,
    host: "ec2-54-247-123-231.eu-west-1.compute.amazonaws.com",
    ssl: true
  });

// const client = new Client({
//   connectionString: connection,
//   ssl: true,
// });

client.connect();

client.query('')


//  client.query('ALTER TABLE "Time_Capsule-Recipient" ADD CONSTRAINT "Time_Capsule-Recipient_fk0" FOREIGN KEY ("CapsuleID") REFERENCES "Time_Capsule"("CapsuleID"); ALTER TABLE "Content" ADD CONSTRAINT "Content_fk0" FOREIGN KEY ("CapsuleID") REFERENCES "Time_Capsule"("CapsuleID");ALTER TABLE "Content" ADD CONSTRAINT "Content_fk1" FOREIGN KEY ("CollaborateID") REFERENCES "Collaborate"("CollaborateID");ALTER TABLE "Content-Content" ADD CONSTRAINT "Content-Content_fk0" FOREIGN KEY ("ContentID") REFERENCES "Content"("ContentID");ALTER TABLE "And" ADD CONSTRAINT "And_fk0" FOREIGN KEY ("CapsuleID") REFERENCES "Time_Capsule"("CapsuleID");ALTER TABLE "And" ADD CONSTRAINT "And_fk1" FOREIGN KEY ("CollaborateID") REFERENCES "Collaborate"("CollaborateID");ALTER TABLE "Consist_of" ADD CONSTRAINT "Consist_of_fk0" FOREIGN KEY ("CollaborateID") REFERENCES "Collaborate"("CollaborateID");ALTER TABLE "Consist_of" ADD CONSTRAINT "Consist_of_fk1" FOREIGN KEY ("CollaboratorsID") REFERENCES "Collaborators"("CollabratorsID");', (err, res) => {
//   if (err) throw err;
//   for (let row of res.rows) {
//     console.log(JSON.stringify(row));
//    }
//    client.end();
// });



// mangoose http._connectionListener(socket);
// ds161164/taxidetails


// mongoose.connect('mongodb://127.0.0.1:27017/my_database');
// mongoose.connect('mongodb://chintu123:praveen@123@ds161164.mongolab.com:161164/taxidetails');

//  var db = mongoose.connection;
//  db.on('error', console.error.bind(console, 'connection error:'));
//  db.once('open', function() {
//   // we're connected!
//   console.log("connection succesful");
// });

// Connect to the db
//  MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
//     if(!err) {
//         console.log("We are connected");
//         db.createCollection("DriverDetail", { capped : true, autoIndexId : true, size :
//             6142800, max : 10000 } );
//         return db;
//       }
// });

// var db = MongoClient.connection;




// var Schema = mongoose.Schema;
// //
// // var blogSchema = new Schema({
// //   title:  String,
// //   author: String,
// //   description:   String,
// //   hidden: Boolean
// //
// // });
// //
// var driverSchema = new Schema({
//     DRVFNAME:String,
//     DRVLNAME:String,
//     DRVAGE:Number,
//     CARNUM:{
//         type:String,
//         unique:true
//     },
//     CARNAME:String,
//     ADDRS1:String,
//     ADDRS2:String,
//     CITY:String,
//     ZIPCODE:Number,
//     COUNTRY:String,
//     PHNO:Number,
//     picFile:{type:String}
// },{ strict: false })


// var BookDetail = mongoose.model('BookDetail',blogSchema);
//   var docsdata ;
//  // BookDetail.find({}, function (err, docs) {
//  //    console.log(docs);
//  // });
// //
//
// var driverDetails = mongoose.model('driverDetails',driverSchema);





// var file = fs.createWriteStream(__dirname + "/acess.log", {flags :'a'});
// app.use(morgan('combined',{stream:file}));

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
   console.log(req.body)
   var action = req.body.action;
   var data   = req.body.data;
   var fname  = req.body.fileName;
switch(action) {
    case 'create':

        driverDetails.update(
            {picFile:data.picFile},
            function(err, numberAffected){
            });

        driverDetails.create(data, function (err) {
             if (err) {
                       console.log(err);
                       return handleError(err);
                          }else{
                     res.send({confirm : "created" });
                     console.log("created");

                        }

                      });


            
        break;
    case 'getData':
        console.log('app');
            var docsdata;
            console.log(driverDetails);
            driverDetails.find({}, function (err, docs) {
                docsdata = docs;
                console.log(docsdata);
                res.send({driverData: docsdata});
            });
         break;

    case 'getDetail':
        console.log(data);
        driverDetails.find({CARNUM:data}, function (err, docs) {
            docsdata = docs;

            if(docsdata){
                res.send({driverDetail: docsdata[0]});
            }

        });
        break;
    case 'upLoad':
       function decodeBase64Image(dataString) {
               var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
            response = {};

        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }

        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
        };
        var imageBuffer = decodeBase64Image(data);
        var newPath = __dirname + "/app/images/" + fname;
        fs.writeFile(newPath, imageBuffer.data, function(err) {
                res.send({confirm : "uploaded" , filename:fname });
             });
       break;
    case 'updateDetail':
        var conditions = {CARNUM:data.CARNUM};
        options = { multi: true };
         function callback(err, numAffected) {
              if (err) {
                 console.log(err);
                 return handleError(err);
             }else {
                 res.send({confirm: "Successfully updated", number: numAffected});
             }
             };
        driverDetails.update(conditions,data, options, callback);


        break;
    case 'deleteDetail':
        var conditions = {CARNUM:data.CARNUM};
        options = { multi: true };
    function callback(err, numAffected) {
        if (err) {
            console.log(err);
            return handleError(err);
        }else {
            res.send({confirm: "Successfully deleted", number: numAffected});
        }
    };
        driverDetails.remove(conditions,callback);


        break;

     default:
       
}
})


var server = app.listen(process.env.PORT || 8082, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})
