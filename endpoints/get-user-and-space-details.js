'use strict';

var $http = require('http');
var config = require('./config_values/config');
var S = require('string');
var ObjectId = require('mongodb').ObjectID;

module.exports = getUserAndSpaceDetails;

var space_collection = 'space_collection';
var name_collection = 'name_collection';
var space_hash = "/space/add/";


var trueResponse =  { statusCode: 200,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'OK'
    }
}

var falseResponse =  { statusCode: 400,
    headers: {
        'content-type': 'application/json'
    },
    body: {
        status: 'NO'
    }
}

function getUserAndSpaceDetails (req, res) {

  var userID = req.query.userID;

  if (userID != '') {
   
    var spaceOverview = {
      spaceInfo : {}     
    };
    var spaceDetailsColl = req.db.collection(space_collection);
    spaceDetailsColl.find().toArray(function (err, spaces) {
        console.log(spaces);
        console.log(spaces.length);
      if(err) {
          console.log('MongoDB: Error while retrieving space and user details %s',userID);
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));  
      }
      else if(spaces.length === 0) {
          console.log('No user details %s found',userID);
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"No user details"}));  
      }
      else {        
        //create cookie here:
        spaces[0].spaceDetails.spaceUrl = space_hash + config.space_salt_before + spaces[0]._id + config.space_salt_after
        req.mynewbiesso.user = spaces[0];
        console.log('user and Space details for ID %s  retrieved successfully \n %s',userID,JSON.stringify(spaces[0]));
        res.writeHead(trueResponse.statusCode, trueResponse.headers);
        res.end(JSON.stringify(spaces[0]));

      }

    });

  } else {
    console.log('User with ID %s is not in our system',userID);
    res.writeHead(falseResponse.statusCode, falseResponse.headers);
    res.end(JSON.stringify({status:"User is not registered in system"}));

  }

}
