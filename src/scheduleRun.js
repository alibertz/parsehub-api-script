const request = require('request');
const schedule = require('node-schedule');

// set this to true if you want run scrape
const enable_run = false;

// Make project run scrape every x days, currently set to run every Sunday (0)
if(enable_run){
  const job = schedule.scheduleJob('* * * * 0', function(){
    request({
      uri: `https://www.parsehub.com/api/v2/projects/${proj_token_RUN}/run`,
      method: 'POST',
      form: {
        api_key: "tJykiAW-6zfx",
      }
    }, function(err, resp, body) {
      console.log(body);
    });
  });
}