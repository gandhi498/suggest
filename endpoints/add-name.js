
'use strict';

var $http = require('http');
var S = require('string');
var config = require('./config_values/config');
module.exports = addName;

var space_collection = 'space_collection';
var name_collection = 'name_collection';


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


function addName(req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {
          console.log('Invalid JSON format');
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Invalid JSON format"}));
        }
        
        if(payload.spaceid != "" && payload.spacename !="" && payload.babyname != "" && payload.meaning != "") {
          var currentSensorDb = req.db.collection(name_collection);
          payload.spaceid = S(payload.spaceid).between(config.space_salt_before,config.space_salt_after);
          currentSensorDb.find({ "spaceid": payload.spaceid,"spacename": payload.spacename, "babyname": payload.babyname }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: addName : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                console.log("Server.js: addName : in zero");
                  var tempDateTime = new Date();

                  req.db.collection(name_collection).insertOne({
                      "spaceid": payload.spaceid,
                      "spacename": payload.spacename,
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
}