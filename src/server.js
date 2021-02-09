const request = require('request');
const express = require('express');
const schedule = require('node-schedule');

// init response data obj
let res = {};

// Parsehub project token - change to get different project run data
const proj_token_GET = "ter8mjkhMX7d"
const proj_token_RUN = "ter8mjkhMX7d"

// set this to true if you want run scrape
const enable_run = false;

// *** GET SPECIFIC PROJECT RUN DATA ***
request({
  uri: `https://www.parsehub.com/api/v2/runs/${proj_token}/data`,
  method: 'GET',
  gzip: true,
  qs: {
    api_key: "tJykiAW-6zfx",
    format: "json"
  }
}, function(err, resp, body) {
  res = JSON.parse(body);
  // console.log(res._[1].product);
  console.log(res);
});

// Make project run scrape every x days
if(enable_run){
  const job = schedule.scheduleJob('* * * * 0', function(){
    request({
      uri: 'https://www.parsehub.com/api/v2/projects/{PROJECT_TOKEN}/run',
      method: 'POST',
      form: {
        api_key: "tJykiAW-6zfx",
      }
    }, function(err, resp, body) {
      console.log(body);
    });
  });
}

// express server setup
const app = express();
const port = 8000;
app.get('/', (req, res) => {
  res.send('Parsehub API script')
})
app.listen(port, () => {
  console.log(`Parsehub API script listening at http://localhost:${port}`)
})