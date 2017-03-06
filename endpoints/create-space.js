'use strict';

var $http = require('http');
var config = require('./config_values/config');
module.exports = createSpace;

var space_collection = 'space_collection',
 name_collection = 'name_collection',
 space_hash = "/#!/mySpace?spaceid=";

var trueResponse =  { statusCode: 200,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'OK'
    }
}

var falseResponse =  { 
  statusCode: 401,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'NO'
    }
}


function createSpace (req, res) {
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
          var currentSensorDb = req.db.collection(space_collection);
          currentSensorDb.find({ "spacename": payload.spacename }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: end : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                  var tempDateTime = new Date();

                  req.db.collection(space_collection).insertOne({
                      "spacename":payload.spacename,
                      "email": payload.email,
                      "name":payload.name,
        	          	"expectingNameFor":payload.expectingNameFor,
        							"expectingOn": payload.expectingOn,
                      "addedOn" : tempDateTime,
                      "active" : false
                  }, function(error, result) {
                      if(error) {
                          console.log('Error while adding data to space table. For space name %s',payload.spacename);
                          res.writeHead(falseResponse.statusCode, falseResponse.headers);
                          res.end(JSON.stringify({status:"Error in mongo DB"}));
                      }
                      else {
                          //here appending salt value to original mongodb ID, for security.
                          trueResponse.body.spaceurl = space_hash+config.space_salt_before+result.insertedId+config.space_salt_after;
                          console.log('Space %s created successfully, URL: %s, on %s',payload.spacename,trueResponse.body.spaceurl,tempDateTime);
                          
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
}