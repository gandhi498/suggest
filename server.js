/**
 * Created by harshadbankar on 19/07/16.
 */
var express = require('express');
var app = require('express')();
//Load the request module
var request = require('request');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var databaseName = 'suggst',defaultBatteryVoltage=4000;
var CronJob = require('cron').CronJob;
var db;
var MongoClient = require('mongodb').MongoClient;
var Mailgun = require('mailgun-js');

// config for sending mailgun
//Your api key, from Mailgun’s Control Panel
var api_key = 'key-ba3883b021ff25feee3417cc7a5b42fd';
//var api_key = 'key-ba3883b021ff25feee3417cc7a5b42fd';
//Your domain, from the Mailgun Control Panel
//var domain = ' sandbox2dcc94c2185c45bcab3ead542de27ded.mailgun.org';
var domain = 'sandboxb2c0218f23304b37a9ce48e3f406c34c.mailgun.org';

//Your sending email address
var from_who = 'welcome@suggest.com';


var mongoURL;
if(process.env.PROD_MONGODB != undefined) {
     mongoURL = process.env.PROD_MONGODB;
} else if(process.env.OPENSHIFT_MONGODB_DB_URL != undefined) {
     mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL;
}
else {
    mongoURL = 'mongodb://localhost:27017/'+databaseName;
}
console.log("mongoURL: "+mongoURL);

var space_collection = 'space_collection';
var name_collection = 'name_collection';

var tc = require("timezonecomplete");

//process.env.OPENSHIFT_MONGODB_DB_URL
MongoClient.connect(mongoURL, function (err, dbinstance) {

    console.log("Connected correctly to Mongo server");
    db = dbinstance;

    db.collections(function (err, collections) {
        console.log("Total collections : " + collections.length);

//      code to drop all the collections
         // collections.forEach(function (collValue) {
         // var deleteFlag = collValue.drop();
         // console.log(deleteFlag);
         // });
    });
});

app.use(express.static('public'));
// if(process.env) {
//     console.log(JSON.stringify(process.env));
// }

var port = 8081;
if (process.env.OPENSHIFT_NODEJS_PORT != undefined) {
  port = process.env.OPENSHIFT_NODEJS_PORT;
  console.log("openshift portt" + port);
} else if (process.env.PORT != undefined) {
  port = process.env.PORT;
  console.log("heroku portt" + port);
} else {
  console.log("local portt" + port);
}


http.listen(port, function () {
    if (!process.env.PORT) {
        console.log('server listening on http://localhost:8081');
    }
    else {
         console.log("Express server listening on port %d", http.address().port)
    }

});

io.on('connection', function (socket) {
    console.log('new user connected: '+socket.id);

    socket.emit('sensor_data', {});
});


//Added for Suggst


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


app.post('/createspace', function (req, res) {
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
          var currentSensorDb = db.collection(space_collection);
          currentSensorDb.find({ "spacename": payload.spacename }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: end : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                  var tempDateTime = new Date();

                  db.collection(space_collection).insertOne({
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
                          console.log('Space %s created successfully, on %s',payload.spacename, tempDateTime);
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
});

app.post('/addname', function (req, res) {
    var buffer = [];

    req.on('data', function (chunk) {
        buffer.push(chunk);
    });

    req.on('end', function () {
        var payload = {};
        try {
            payload = JSON.parse(Buffer.concat(buffer).toString());
        } catch (e) {}

        if(payload.babyname != "" && payload.meaning != "") {
          var currentSensorDb = db.collection(name_collection);
          currentSensorDb.find({ "spacename": payload.spacename, "babyname": payload.babyname }).toArray(function (err, allMsg) {
              if(err)
              {
                console.log("Server.js: addName : in Err");
                  res.writeHead(trueResponse.statusCode, trueResponse.headers);
                  res.end(JSON.stringify(trueResponse.body));
              }
              else if(allMsg.length==0) {
                console.log("Server.js: addName : in zero");
                  var tempDateTime = new Date();

                  db.collection(name_collection).insertOne({
                      "spacename":payload.spacename,
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
});

app.post('/vote', function (req, res) {
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

        if(spacename !== '') {
          db.collection(name_collection).update( { "spacename": spacename, "babyname": babyname}, { $set: {"likes":payload.likes} }
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
});


app.get('/getNamesForSpace', function(req, res) {

  var space = req.query.spacename;
  console.log(" getting name list for space %s :", space);

  if (space != '' && space != undefined) {
    console.log(" getting name list for space : %s", space);

    var spaceOverview = {
      spaceInfo : {},
      nameList : []
    };
    db.collection(space_collection).find({"spacename":space}).toArray(function (err, spaces) {
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

    db.collection(name_collection).find({"spacename":space}).toArray(function (err, allSensors) {
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

});


app.get('/dashboard', function(req, res) {

  db.collection(space_collection).find().toArray(function (err, spaceList) {

    res.writeHead(trueResponse.statusCode, trueResponse.headers);
    res.end(JSON.stringify({ "date:":getTodaysDate(), "nmbrUniqueNames" : 10, "spaceList" :  spaceList }));

    ///console.log(this.spaceList + "count" + spaceCount.length + JSON.stringify(spaceCount));
  });

});

app.get('/name', function(req, res) {
   var paramChar = req.param('char');
   console.log('Getting name for %s', paramChar);

  db.collection(name_collection).find({"babyname" : {'$regex': '^' + paramChar}}).toArray(function (err, nameList) {

    res.writeHead(trueResponse.statusCode, trueResponse.headers);
    res.end(JSON.stringify({ "nameList" :  nameList }));

    console.log("count" + nameList.length + JSON.stringify(nameList));
  });

});

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


/**
  * Schedule job to send mail with new updates
  */

var job = new CronJob('00 51 16 * * 1-5', function() {
  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 PM. It does not run on Saturday
   * or Sunday.
   */
   console.log('runs!!!!!!!!!!!!!');
   sendMail();
  }, function () {
    /* This function is executed when the job stops */
    console.log('The answer to life, the universe, and everything!!!!!!!!!!!!!');

  },
  true /* Start the job right now */
  /*timeZone  Time zone of this job. */
);

// Send a message to the specified email address when you navigate to /submit/someaddr@email.com
function sendMail() {

    //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});
    var sendTo = "gandhi498@gmail.com";
    var data = {
    //Specify email data
      from: from_who,
    //The email to contact
      to: sendTo,
    //Subject and text data
      subject: 'Hello from Mailgun',
      html: 'Hello'
    }
console.log('Th');
    //Invokes the method to send emails given the above data with the helper library
    mailgun.messages().send(data, function (err, body) {
        //If there is an error, render the error page
        if (err) {
            //res.render('error', { error : err});
            console.log("got an error: ", err);
        }
        //Else we can greet    and leave
        else {
            //Here "submitted.jade" is the view file for this landing page
            //We pass the variable "email" from the url parameter in an object rendered by Jade
            //res.render('submitted', { email : sendTo });
            console.log('submitted to %s', sendTo );
            console.log(body);
        }
    });

}
