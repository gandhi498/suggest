/**
 * Created by harshadbankar on 19/07/16.
 */
var $express = require('express'),
    app = require('express')(),
    request = require('request'),
    http = require('http').createServer(app),
    io = require('socket.io')(http),
    databaseName = 'suggst',
    $path = require('path'),
    $upTheTree = require('up-the-tree'),
    $fs = require('fs'),
    db,
    MongoClient = require('mongodb').MongoClient,
    sessionCookieName = 'mynewbiesso';
    sessionCookieSecret = 'qwh7SubJlZfRHJnhkx8dY3ziV7fqLxk7P7DaK2Rc';
    session = require('client-sessions');

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
console.log("mongoURL: "+ mongoURL);

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
app.use(session({
  cookieName: sessionCookieName,
  secret: sessionCookieSecret,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  httpOnly: false,
  secure: false,
  ephemeral: false
}));

app.use("/", function (request, response, next) {
    if(request.path === "/") {
        response.redirect('/space/create');
    }  
    else {
        next();
    } 
});

var $createspace = require('./endpoints/create-space');
var $logout = require('./endpoints/logout');
var $checksession = require('./endpoints/check-session');
var $getSpaceDetails = require('./endpoints/get-space-details');
var $getUserAndSpaceDetailsById = require('./endpoints/get-user-and-space-details');
var $addName = require('./endpoints/add-name');
var $vote = require('./endpoints/vote');
var $getNamesForSpace = require('./endpoints/get-names-for-space');
var $dashboard = require('./endpoints/dashboard');
var $getNamesForLetter = require('./endpoints/get-names-for-letter');

// Create Space Junction router 
var createSpacejunctionRouter = $express.Router();

createSpacejunctionRouter.use('/',_serveCreateSpaceIndex);
createSpacejunctionRouter.use('/', $express.static('static/create_space')); // serve from create_space folder

createSpacejunctionRouter.post('/createspace', $createspace); // Now endpoint will be : /space/create/createspace
createSpacejunctionRouter.get('/checksession', $checksession);
createSpacejunctionRouter.get('/logout', $logout);
createSpacejunctionRouter.get('/getUserAndSpaceDetailsById',$getUserAndSpaceDetailsById);

app.use('/space/create', createSpacejunctionRouter);


// Add name Junction router 
var addNameJunctionRouter = $express.Router();
addNameJunctionRouter.use('/',_serveAddSpaceIndex);
addNameJunctionRouter.use('/', $express.static('static/add_name')); // serve from add_name folder

addNameJunctionRouter.get('/getSpaceDetails', $getSpaceDetails); // End point : /space/add/getSpaceDetails
addNameJunctionRouter.post('/addName', $addName); // Now endpoint will be : /space/add/addName
addNameJunctionRouter.post('/vote', $vote); // Now endpoint will be : /space/add/vote
addNameJunctionRouter.get('/getNamesForSpace', $getNamesForSpace); // Now endpoint will be : /space/add/getNamesForSpace
addNameJunctionRouter.get('/getNamesForLetter', $getNamesForLetter)


app.use('/space/add', addNameJunctionRouter);

// Admin Junction router 
var dashboardJunctionRouter = $express.Router();
dashboardJunctionRouter.use('/',_serveAdminSpaceIndex);
dashboardJunctionRouter.use('/', $express.static('static/admin_space')); // serve from admin_space folder
dashboardJunctionRouter.get('/dashboard', $dashboard); // Now endpoint will be: /space/admin/dashboard

app.use('/space/admin', dashboardJunctionRouter);


function _serveCreateSpaceIndex (req, res, next) {

    if (req.path === '/') {
        var redirectUriParams = {
            error: 'access_denied'
        };

        var content = $fs.readFileSync($path.resolve($upTheTree(), __dirname, 'static/create_space/index.html')).toString();

        res.end(content);
    }
    else {
        next();
    }

}

function _serveAddSpaceIndex (req, res, next) {

    if (req.path === '/') {
        var redirectUriParams = {
            error: 'access_denied'
        };

        var content = $fs.readFileSync($path.resolve($upTheTree(), __dirname, 'static/add_name/index.html')).toString();

        res.end(content);
    }
    else {
        next();
    }

}

function _serveAdminSpaceIndex (req, res, next) {

    if (req.path === '/') {
        var redirectUriParams = {
            error: 'access_denied'
        };

        var content = $fs.readFileSync($path.resolve($upTheTree(), __dirname, 'static/admin_space/index.html')).toString();

        res.end(content);
    }
    else {
        next();
    }

}
