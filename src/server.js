const request = require('request');
const express = require('express');
const app = express();
const port = 8000;

let res = {};

app.get('/', (req, res) => {
  res.send('Parsehub API script')
})

app.listen(port, () => {
  console.log(`Parsehub API script listening at http://localhost:${port}`)
})


// *** GET PROJECT DATA ***
// request({
//   uri: 'https://www.parsehub.com/api/v2/projects/tubwj7TTKznC',
//   method: 'GET',
//   qs: {
//     api_key: "tJykiAW-6zfx",
//     limit: "1",
//   }
// }, function(err, resp, body) {
//   res = JSON.parse(body);
//   console.log(res);
// });

// *** GET SPECIFIC PROJECT RUN DATA ***
request({
  uri: 'https://www.parsehub.com/api/v2/runs/ter8mjkhMX7d/data',
  method: 'GET',
  gzip: true,
  qs: {
    api_key: "tJykiAW-6zfx",
    format: "json"
  }
}, function(err, resp, body) {
  res = JSON.parse(body);
  console.log(res._[1].product);
  // console.log(res);
});