'use strict';

var $http = require('http');
var config = require('./config_values/config');
var ObjectId = require('mongodb').ObjectID;

module.exports = checkSession;

var space_collection = 'space_collection',
    name_collection = 'name_collection';

var trueResponse = {
    statusCode: 200,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'OK'
    }
}

var falseResponse = {
    statusCode: 400,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'NO'
    }
}


function checkSession(req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        if(req.mynewbiesso && req.mynewbiesso.user.spaceDetails && req.mynewbiesso.user.socialData) {
            
            var currentSensorDb = req.db.collection(space_collection);
            currentSensorDb.find({
                "_id": ObjectId(req.mynewbiesso.user.spaceDetails.spaceID),
            }).toArray(function (err, allMsg) {
                if (err) {
                    console.log("Error in checking user session");
                    res.writeHead(falseResponse.statusCode, falseResponse.headers);
                    res.end(JSON.stringify({
                        status: "Invalid Session"
                    }));
                } else if (allMsg.length == 1) {
                    var tempDateTime = new Date();
                    res.writeHead(trueResponse.statusCode, trueResponse.headers);
                    res.end(JSON.stringify(req.mynewbiesso.user));
                    
                } else {
                    console.log('%s Space already present.', payload.sensorId);
                    res.writeHead(falseResponse.statusCode, falseResponse.headers);
                    res.end(JSON.stringify({
                        status: "Invalid Session"
                    }));
                }
            });
        }
        else {
            res.writeHead(falseResponse.statusCode, falseResponse.headers);
            res.end(JSON.stringify({
                status: "Invalid Session"
            }));
        }

    });
}