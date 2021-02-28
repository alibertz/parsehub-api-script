const request = require('request');
const express = require('express');
const schedule = require('node-schedule');
const _ = require('lodash');

// set this to true if you want run scrape
const enable_run = false;

const proj_tokens = {
  salumeria: "td_wt_Buc1so",
  urbancycles: "tKSxi9UT-B_z"
}

// function that handles parameter renaming for the purpose of field mapping according to product schema
function rename_param(obj, old_name, new_name) {
  obj[new_name] = obj[old_name];
  delete obj[old_name];
}

const getParsehubAPIData = ( proj_token ) => {
  let last_run_obj = {};

  // api call requests last available run made for Parsehub project (store)
  // (depending on the project token given)
  request({
    uri: `https://www.parsehub.com/api/v2/projects/${proj_token}/last_ready_run/data`,
    method: 'GET',
    gzip: true,
    qs: {
      api_key: "tJykiAW-6zfx",
      format: "json"
    }
  }, function(err, resp, body) {
      last_run_obj = JSON.parse(body);
      let new_records = [];

      // main switch statement that applies different normalizing
      // scripts depending on store & project token given
      switch (proj_token) {
          
        // ************************
        // salumeria mapping script
        case proj_tokens.salumeria:

          last_run_obj = last_run_obj.category;

          // for each category of salumeria store inventory array
          for (let i = 0; i < Object.keys(last_run_obj).length; i++) {
            
            let category_name = last_run_obj[i].CategoryName;
            let products = last_run_obj[i].product;

            // for each product within each category
            for (let i = 0; i < products.length; i++) {
              products[i]['category'] = [category_name];

              rename_param(products[i], 'Name', 'name');
              rename_param(products[i], 'image_url', 'imageLink');
              products[i]['brand'] = "";
              products[i]['tags'] = [];
              products[i]['stockCount'] = [];
              products[i]['store'] = {};
              products[i]['location'] = {};
              products[i]['dataSource'] = {};
              products[i]['ingestionDate'] = {};

              new_records.push(products[i]);
            }
          }
          console.log(new_records);
          break;


        // **************************
        // urbancycles mapping script
        case proj_tokens.urbancycles:

          last_run_obj = last_run_obj.category;

          // for each category
          for (let i = 0; i < Object.keys(last_run_obj).length; i++) {
            let category_name = last_run_obj[i].name;

            // only proceed if category has subcategories - no products if no subcategory
            if (_.has(last_run_obj[i], 'subcategory')) {
              let subcategories = last_run_obj[i].subcategory;
              let subcategory_name = last_run_obj[i].subcategory.name;

              // for each subcategory within each category
              for (let j = 0; j < subcategories.length; j++) {
                let products = subcategories[j].item;

                // for each product within each subcategory
                for (let k = 0; k < products.length; k++) {
                  products[k]['category'] = [category_name];
    
                  products[k]['brand'] = "";
                  products[k]['tags'] = [];
                  products[k]['stockCount'] = [];
                  products[k]['store'] = {};
                  products[k]['location'] = {};
                  products[k]['dataSource'] = {};
                  products[k]['ingestionDate'] = {};
    
                  new_records.push(products[k]);
                }
              }
            }            
          }
          console.log(new_records);
          break;
      
        default:
          break;
      }
  });
}

getParsehubAPIData(proj_tokens.urbancycles);



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

// express server setup
const app = express();
const port = 8000;
app.get('/', (req, res) => {
  res.send('Parsehub API script')
})
app.listen(port, () => {
  // console.log(`Parsehub API script listening at http://localhost:${port}`)
  return;
})