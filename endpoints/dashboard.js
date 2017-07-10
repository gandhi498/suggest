'use strict';

var $http = require('http');

module.exports = dashboard;

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

function dashboard (req, res) {

  req.db.collection(space_collection).find().toArray(function (err, spaceList) {

    var nameList = req.db.collection(name_collection).find().toArray();
    res.writeHead(trueResponse.statusCode, trueResponse.headers);
    res.end(JSON.stringify({ "date:":getTodaysDate(), "nmbrUniqueNames" : 10, "spaceList" :  spaceList, "nameList" : nameList }));

    ///console.log(this.spaceList + "count" + spaceCount.length + JSON.stringify(spaceCount));
  });

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
