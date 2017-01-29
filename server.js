/**
 * Created by harshadbankar on 19/07/16.
 */
var express = require('express');
var app = require('express')();
//Load the request module
var request = require('request');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var databaseName = 'suggst',defaultBatteryVoltage=4000;

var db;
var MongoClient = require('mongodb').MongoClient;

var mongoURL;
if(process.env.PROD_MONGODB != undefined) {
     mongoURL = process.env.PROD_MONGODB;
}
else {
    mongoURL = 'mongodb://localhost:27017/'+databaseName;
}
console.log("mongoURL: "+mongoURL);

var space_collection = 'space_collection';
var name_collection = 'name_collection';

var tc = require("timezonecomplete");

//process.env.OPENSHIFT_MONGODB_DB_URL
MongoClient.connect(mongoURL, function (err, dbinstance) {

    console.log("Connected correctly to Mongo server");
    db = dbinstance;

    db.collections(function (err, collections) {
        console.log("Total collections : " + collections.length);

//      code to drop all the collections
         // collections.forEach(function (collValue) {
         // var deleteFlag = collValue.drop();
         // console.log(deleteFlag);
         // });
    });
});

app.use(express.static('public'));
// if(process.env) {
//     console.log(JSON.stringify(process.env));
// }

http.listen(process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8081, function () {
    if (!process.env.OPENSHIFT_NODEJS_PORT) {
        console.log('server listening on http://localhost:8081');
    }
    else {
         console.log("Express server listening on port %d", http.address().port)
    }

});

io.on('connection', function (socket) {
    console.log('new user connected: '+socket.id);

    socket.emit('sensor_data', {});
});


//Added for Suggst


var trueResponse =  { statusCode: 200,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'OK'
    }
}

var falseResponse =  { statusCode: 401,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'NO'
    }
}


app.post('/createspace', function (req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        if(payload.spacename != "" && payload.email != "") {
          var currentSensorDb = db.collection(space_collection);
          currentSensorDb.find({ "spacename": payload.spacename }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: end : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                  var tempDateTime = new Date();

                  db.collection(space_collection).insertOne({
                      "spacename":payload.spacename,
                      "email": payload.email,
                      "addedOn" : tempDateTime,
                      "active" : false
                  }, function(error, result) {
                      if(error) {
                          console.log('Error while adding data to space table. For space name %s',payload.spacename);
                          res.writeHead(falseResponse.statusCode, falseResponse.headers);
                          res.end(JSON.stringify({status:"Error in mongo DB"}));
                      }
                      else {
                          console.log('Space %s created successfully, on %s',payload.spacename, tempDateTime);
                          res.writeHead(trueResponse.statusCode, trueResponse.headers);
                          res.end(JSON.stringify(trueResponse.body));
                      }
                  });
              }
              else{
                  console.log('%s Space already present.',payload.sensorId);
                  res.writeHead(falseResponse.statusCode, falseResponse.headers);
                  res.end(JSON.stringify({status:"This space already present"}));
              }
          });
        }
    });
});

app.post('/addname', function (req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        if(payload.babyname != "" && payload.meaning != "") {
          var currentSensorDb = db.collection(name_collection);
          currentSensorDb.find({ "spacename": payload.spacename, "babyname": payload.babyname }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: addName : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                console.log("Server.js: addName : in zero");
                  var tempDateTime = new Date();

                  db.collection(name_collection).insertOne({
                      "spacename":payload.spacename,
                      "babyname": payload.babyname,
                      "meaning": payload.meaning,
                      "gender": payload.gender,
                      "addedBy": payload.addedBy,
                      "addedOn" : tempDateTime,
                      "likes": 0
                  }, function(error, result) {
                      if(error) {
                          console.log('Error while adding baby name to name table. Babyname %s For space name %s', payload.babyname, payload.spacename);
                          res.writeHead(falseResponse.statusCode, falseResponse.headers);
                          res.end(JSON.stringify({status:"Error in mongo DB"}));
                      }
                      else {
                          console.log('Babyname %s added successfully, on %s',payload.babyname, tempDateTime);
                          res.writeHead(trueResponse.statusCode, trueResponse.headers);
                          res.end(JSON.stringify(trueResponse.body));
                      }
                  });
              }
              else{
                  console.log('name %s is already present in the space %s',payload.babyname, payload.spacename);
                  res.writeHead(falseResponse.statusCode, falseResponse.headers);
                  res.end(JSON.stringify({status:"This name is already present"}));
              }
          });
        }
    });
});

app.post('/vote', function (req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        var babyname = payload.babyname;
        var spacename = payload.spacename;
        var likes = payload.likes;

        console.log(" update vote [%s] for space %s :", likes, spacename);


        if(spacename !== '') {
//          db.collection(name_collection).update( { "_id" : id}, {$set: {likes:likes}});
          db.collection(name_collection).update( { "spacename": spacename, "babyname": babyname}, { $set: {"likes":payload.likes} }
            , function(err, results) {
                          if(err)
                          {
                            console.log("Server.js: addName : in Err %s", err);
                              res.writeHead(trueResponse.statusCode, trueResponse.headers);
                              res.end(JSON.stringify(trueResponse.body));
                          } else{
                              console.log('is already present in the space %s',results);
                            //  res.writeHead(falseResponse.statusCode, falseResponse.headers);
                              res.end(JSON.stringify({status:results}));
                          }
                      }
           );




        }
    });
});


app.get('/getNamesForSpace', function(req, res) {

  var space = req.query.spacename;
  console.log(" getting name list for space %s :", space);

  if (space != '' && space != undefined) {
    console.log(" getting name list for space : %s", space);

    var nameDb = db.collection(name_collection);
    nameDb.find({"spacename":space}).toArray(function (err, allSensors) {
      if(err) {
          console.log('Error while retrieving list');
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));
      }
      else {
        console.log('Babyname list retrieved successfully \n %s',JSON.stringify(allSensors));
          res.writeHead(trueResponse.statusCode, trueResponse.headers);
          res.end(JSON.stringify(allSensors));
      }
    });

  } else {
    console.log('Error NO Space name');
    res.writeHead(falseResponse.statusCode, falseResponse.headers);
    res.end(JSON.stringify({status:"Space name missing"}));

  }

});


app.get('/dashboard', function(req, res) {

  res.writeHead(trueResponse.statusCode, trueResponse.headers);
  res.end(JSON.stringify({"date:":getTodaysDate(), "nmbrUniqueSpace" : 3, "nmbrUniqueNames" : 10}));
  console.log('Error NO Space namedd'+getTotalSpace());

});

function getTotalSpace() {

  var nmbrSpace = -1;
  var spaceDb = db.collection(space_collection);
  spaceDb.find({count:"spacename"}).toArray(function (err, spaceCount) {
    console.log("count" + spaceCount[0] + JSON.stringify(spaceCount[0]));
    nmbrSpace = spaceCount.length;
  });

  return nmbrSpace;
}

function getTodaysDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return mm + '/' + dd + '/' + yyyy;
};

function getCurrentTime() {
    var d = new Date(); // for now
    var hrs = (d.getHours() < 10 ? '0' : '') + d.getHours(); // => 9
    var min = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes(); // =>  30
    var sec = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();

    return hrs + ":" + min + ":" + sec;
};
