'use strict';

var $http = require('http');
var config = require('./config_values/config');
module.exports = createSpace;

var space_collection = 'space_collection',
    name_collection = 'name_collection',
    space_hash = "/space/add/";

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


function createSpace(req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        if (payload.socialData != "" && payload.spaceDetails != "") {
            var currentSensorDb = req.db.collection(space_collection);
            currentSensorDb.find({
                "spacename": payload.spaceDetails.spaceName,
                "email": payload.socialData.email,
            }).toArray(function (err, allMsg) {
                if (err) {
                    console.log("Server.js: end : in Err");
                    res.writeHead(falseResponse.statusCode, falseResponse.headers);
                    res.end(JSON.stringify(falseResponse.body));
                } else if (allMsg.length == 0) {
                    var tempDateTime = new Date();

                    req.db.collection(space_collection).insertOne({
                        "spacename": payload.spaceDetails.spaceName,
                        "email": payload.socialData.email,
                        "socialDetails": {
                            "fbID":payload.socialData.userID,
                            "gender":payload.socialData.gender,
                            "profileLink": payload.socialData.link,
                            "profilePicture": payload.socialData.picture.data.url,
                            "name": payload.socialData.first_name+ " " +payload.socialData.last_name,
                        },
                        "expectingNameFor": payload.spaceDetails.expectingNameFor,
                        "expectingOn": payload.spaceDetails.expectingOn,
                        "addedOn": tempDateTime,
                        "active": false
                    }, function (error, result) {
                        if (error) {
                            console.log('Error while adding data to space table. For space name %s', payload.spacename);
                            res.writeHead(falseResponse.statusCode, falseResponse.headers);
                            res.end(JSON.stringify({
                                status: "Error in mongo DB while creating space"
                            }));
                        } else {
                            //here appending salt value to original mongodb ID, for security.
                            trueResponse.body.spaceurl = space_hash + config.space_salt_before + result.insertedId + config.space_salt_after;
                            console.log('Space %s created successfully, URL: %s, on %s', payload.spaceDetails.spaceName, trueResponse.body.spaceurl, tempDateTime);
                            var sessionData = {};
                            sessionData.socialData = payload.socialData;
                            sessionData.spaceDetails = payload.spaceDetails;
                            req.mynewbiesso.user = sessionData;
                            res.writeHead(trueResponse.statusCode, trueResponse.headers);
                            res.end(JSON.stringify(trueResponse.body));
                        }
                    });
                } else {
                    console.log('%s Space already present.', payload.sensorId);
                    res.writeHead(falseResponse.statusCode, falseResponse.headers);
                    res.end(JSON.stringify({
                        status: "This space already present"
                    }));
                }
            });
        }
    });
}