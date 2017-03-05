# suggest


heroku config:set PROD_MONGODB=mongodb://dbuser:dbpass@host1:port1,host2:port2/dbname
heroku config:set PROD_MONGODB=mongodb://dbuser:dbpass@host1:port1,host2:port2/suggest
heroku config:set PROD_MONGODB=mongodb://suggest_u:suggest@ds056419.mlab.com:56419/suggest

######## Frontend Notes: 

Pointed to build folder in server.js. So now only npm install and node server in root folder is enough to start application 

Create Space FE
validations : Done : All fields are mandatory, email check
			  Pending : Date validation

Success scenario : Show confirmation of space created and option to copy link.

Error scenario : Needs to be handled. need proper error response from BE. TBD with harshad


######## Backend notes : 

Endpoints : 
	1. POST:	/createSpace  :
			a. payload = email,expectingNameFor,expectingOn,name,spacename;
			b. Success Response = 
					{"status":"OK","spaceurl":"/#!/mySpace?spaceid=Qewejhewj58bc9a26ef47a3446c85932dqwQASFUTw"}
			c. Error responses = 
				/*yet to map error responses*/		

	2. GET: /getNamesForSpace :
			a. payload [as url param] = spaceid
			b. response = {"nameList":[]}
			c. Error responses = 			
				/*yet to map error responses*/		