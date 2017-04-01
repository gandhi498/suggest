'use strict';

var $http = require('http');
var config = require('./config_values/config');
var S = require('string');
var ObjectId = require('mongodb').ObjectID;

module.exports = getNamesForLetter;

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

function getNamesForLetter (req, res) {

  var letter = req.query.letter;

  if (letter !== '' && letter !== undefined) {

    var namesOverview = {
      nameList : []   
    };    

    req.db.collection(name_collection).find({"babyname" : {'$regex': '^' + letter}}).toArray(function (err, names) {
      if(err) {

          console.log('Error while retrieving names starting with '+letter);
          res.writeHead(falseResponse.statusCode, falseResponse.headers);
          res.end(JSON.stringify({status:"Error in mongo DB"}));
          
      } else {
        
        namesOverview.nameList = names;
        console.log('Names retrieved successfully \n %s',JSON.stringify(namesOverview));
        res.writeHead(trueResponse.statusCode, trueResponse.headers);
        res.end(JSON.stringify(namesOverview));

      }

    });

  } else {
    console.log('Error NO letter provided');
    res.writeHead(falseResponse.statusCode, falseResponse.headers);
    res.end(JSON.stringify({status:"Letter missing"}));

  }
 
}
