'use strict';

module.exports = sendMail;
module.exports = startEmailJob;

var CronJob = require('cron').CronJob,
    Mailgun = require('mailgun-js');
    
/**
  * Schedule job to send mail with new updates
  */

function startEmailJob () {
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
}
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