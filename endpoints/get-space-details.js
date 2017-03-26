'use strict';

var $http = require('http');
var config = require('./config_values/config');
var S = require('string');
var ObjectId = require('mongodb').ObjectID;

module.exports = getSpaceDetails;

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

function getSpaceDetails (req, res) {

  var space = req.query.spaceid;

  if (space != '' && space != undefined) {
  
    //here remove salt to get object_id using which finding space is easy.
    //.s to convert object to string 
    space = S(space).between(config.space_salt_before,config.space_salt_after).s;   

    var spaceOverview = {
      spaceInfo : {}     
    };

    req.db.collection(space_collection).findOne({"_id": ObjectId(space)}, function (err, spaces) {
      if(err) {

          console.log('Error while retrieving space details');
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));
          
      }
      else {        
        
        spaceOverview.spaceInfo = spaces;
        console.log('Space Details retrieved successfully \n %s',JSON.stringify(spaceOverview));
        res.writeHead(trueResponse.statusCode, trueResponse.headers);
        res.end(JSON.stringify(spaceOverview));

      }

    });

  } else {
    console.log('Error NO Space name');
    res.writeHead(falseResponse.statusCode, falseResponse.headers);
    res.end(JSON.stringify({status:"Space name missing"}));

  }

}
