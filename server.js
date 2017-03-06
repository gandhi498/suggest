/**
 * Created by harshadbankar on 19/07/16.
 */
var express = require('express'),
    app = require('express')(),
    request = require('request'),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    databaseName = 'suggst',
    db,
    MongoClient = require('mongodb').MongoClient;

var config = require('./endpoints/config_values/config');
console.log("Config values: "+JSON.stringify(config));

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

        // //code to drop all the collections
        //  collections.forEach(function (collValue) {
        //  var deleteFlag = collValue.drop();
        //  console.log(deleteFlag);
        //  });
    });
});

app.use(express.static('build'));

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

//Added for Suggst
app.all('*', function(request, response, next)
    {
    request.db = db;
    next();
});

var $createspace = require('./endpoints/create-space');
var $addname = require('./endpoints/add-name');
var $vote = require('./endpoints/vote');
var $getNamesForSpace = require('./endpoints/get-names-for-space');
var $dashboard = require('./endpoints/dashboard');

app.post('/createspace', $createspace);
app.post('/addname', $addname);
app.post('/vote', $vote);
app.get('/getNamesForSpace', $getNamesForSpace);
app.get('/dashboard', $dashboard);


