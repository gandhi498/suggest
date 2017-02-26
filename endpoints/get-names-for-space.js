'use strict';

var $http = require('http');

module.exports = getNamesForSpace;

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

function getNamesForSpace (req, res) {

  var space = req.query.spacename;
  console.log(" getting name list for space %s :", space);

  if (space != '' && space != undefined) {
    console.log(" getting name list for space : %s", space);

    var spaceOverview = {
      spaceInfo : {},
      nameList : []
    };
    req.db.collection(space_collection).find({"spacename":space}).toArray(function (err, spaces) {
      if(err) {
          console.log('Error while retrieving list');
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));
      }
      else {
        spaceOverview.spaceInfo = spaces[0];
        console.log('Babyname list retrieved successfully \n %s',JSON.stringify(spaceOverview));
          //res.writeHead(trueResponse.statusCode, trueResponse.headers);
          //res.end(JSON.stringify(spaceOverview));
          //res.end(JSON.stringify(allSensors));
      }
    });

    req.db.collection(name_collection).find({"spacename":space}).toArray(function (err, allSensors) {
      if(err) {
          console.log('Error while retrieving list');
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));
      }
      else {
        spaceOverview.nameList = allSensors;
        console.log('spaceOverview Babyname list retrieved successfully \n %s',JSON.stringify(spaceOverview));
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