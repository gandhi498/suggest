'use strict';

var $http = require('http');

module.exports = vote;

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


function vote(req, res) {
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

        if(spacename !== '' && babyname !== '' && likes !== '') {
          req.db.collection(name_collection).update( { "spacename": spacename, "babyname": babyname}, { $set: {"likes":payload.likes} }
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
}