# suggest


heroku config:set PROD_MONGODB=mongodb://dbuser:dbpass@host1:port1,host2:port2/dbname
heroku config:set PROD_MONGODB=mongodb://dbuser:dbpass@host1:port1,host2:port2/suggest
heroku config:set PROD_MONGODB=mongodb://suggest_u:suggest@ds056419.mlab.com:56419/suggest

Pointed to build folder in server.js. So now only npm install and node server in root folder is enough to start application 

Create Space FE
validations : Done : All fields are mandatory, email check
			  Pending : Date validation

Success scenario : Show confirmation of space created and option to copy link.
				   Will the link for new space be sent in the response ?? For now i have just hardcoded

Error scenario : Needs to be handled. need proper error response from BE. TBD with harshad

