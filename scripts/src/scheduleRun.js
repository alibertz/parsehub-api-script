const request = require('request');
const schedule = require('node-schedule');
const proj_tokens = require('./projectTokens');

// set this to true if you want run scrape
const enable_run = true;

// Make project run scrape every x days, currently set to run every Sunday (0)

function scheduleRun(proj_token) {
  if(enable_run){
    // const job = schedule.scheduleJob('* * * * 0', function(){
    //   for (let i = 0; i < proj_tokens.length; i++) {
    //     request({
    //       uri: `https://www.parsehub.com/api/v2/projects/${proj_tokens[i]}/run`,
    //       method: 'POST',
    //       form: {
    //         api_key: "tJykiAW-6zfx",
    //       }
    //     }, function(err, resp, body) {
    //       console.log(body);
    //     });
    //   }

    //   console.log("made run");
    // });
    request({
      uri: `https://www.parsehub.com/api/v2/projects/${proj_token}/run`,
      method: 'POST',
      form: {
        api_key: "tJykiAW-6zfx",
      }
    }, function(err, resp, body) {
      console.log(body);
    });
  }
}

module.exports = scheduleRun;