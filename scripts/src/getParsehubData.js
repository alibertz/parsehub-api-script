const proj_tokens = require('./projectTokens');
const request = require('request');
const _ = require('lodash');

// function that handles parameter renaming for the purpose of field mapping according to product schema
function rename_param(obj, old_name, new_name) {
  obj[new_name] = obj[old_name];
  delete obj[old_name];
}

function getParsehubData( proj_token ) {

  let today = new Date().toLocaleDateString()

  return new Promise((resolve, reject) => {
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

        if (err) return reject(err);
        try {

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
                  products[i]['ingestionDate'] = today;

                  new_records.push(products[i]);
                }
              }
              resolve(last_run_obj);
              break;

            // ***************************
            // Urban Cycles mapping script
            case proj_tokens.urbanCycles:

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
                      delete products[k]['item_name'];
        
                      rename_param(products[k], "url", "productLink");
                      rename_param(products[k], "image", "imageLink");

                      products[k]['brand'] = "";
                      products[k]['tags'] = [];
                      products[k]['stockCount'] = [];
                      products[k]['store'] = {};
                      products[k]['location'] = {};
                      products[k]['dataSource'] = {};
                      products[k]['ingestionDate'] = {today};
                      
                      new_records.push(products[k]);
                    }
                  }
                }            
              }
              resolve(new_records);
              break;

            // ***************************
            // Knit Happens mapping script
            case proj_tokens.knitHappens:
              last_run_obj = last_run_obj.category;
              for (let i = 0; i < Object.keys(last_run_obj).length; i++) {
                let category_name = last_run_obj[i].category;
                let products = last_run_obj[i].product;

                // for each product within each category
                for (let j = 0; j < products.length; j++) {
                  products[j]['category'] = [category_name];

                  rename_param(products[j], 'Link', 'productLink');
                  rename_param(products[j], 'image', 'imageLink');
                  products[j]['brand'] = "";
                  products[j]['tags'] = [];
                  products[j]['stockCount'] = [];
                  products[j]['store'] = {};
                  products[j]['location'] = {};
                  products[j]['dataSource'] = {};
                  products[j]['ingestionDate'] = today;

                  new_records.push(products[j]);
                }
              }
              resolve(new_records);
              break;

            // *******************************
            // Polcari's Coffee mapping script
            case proj_tokens.polcarisCoffee:
              last_run_obj = last_run_obj.category;

              // for each category of salumeria store inventory array
              for (let i = 0; i < Object.keys(last_run_obj).length; i++) {
                
                let category_name = last_run_obj[i].name;
                let products = last_run_obj[i].product;

                // for each product within each category
                for (let j = 0; j < products.length; j++) {
                  products[j]['category'] = [category_name];

                  rename_param(products[j], 'product_name', 'name');
                  rename_param(products[j], 'image', 'imageLink');
                  rename_param(products[j], 'url', 'productLink');
                  products[j]['brand'] = "";
                  products[j]['stockCount'] = [];
                  products[j]['store'] = {};
                  products[j]['location'] = {};
                  products[j]['dataSource'] = {};
                  products[j]['ingestionDate'] = today;

                  new_records.push(products[i]);
                }
              }

              resolve(new_records);
              break;

            // ****************************
            // Chestnut Farm mapping script
            case proj_tokens.chestnutFarm:
              last_run_obj = last_run_obj.category;

              // for each category of salumeria store inventory array
              for (let i = 0; i < Object.keys(last_run_obj).length; i++) {
                
                let category_name = last_run_obj[i].name;
                let products = last_run_obj[i].product;

                // for each product within each category
                for (let i = 0; i < products.length; i++) {
                  products[i]['category'] = [category_name];

                  rename_param(products[i], 'image', 'imageLink');
                  delete products[i]['weight'];
                  products[i]['productLink'] = "";
                  products[i]['brand'] = "";
                  products[i]['tags'] = [];
                  products[i]['stockCount'] = [];
                  products[i]['store'] = {};
                  products[i]['location'] = {};
                  products[i]['dataSource'] = {};
                  products[i]['ingestionDate'] = today;

                  new_records.push(products[i]);
                }
              }
              resolve(last_run_obj);
              break;

            // ****************************
            // Salmagundi mapping script
            case proj_tokens.salmagundi:

              console.log(last_run_obj);
              break;

            // ****************************
            // Wild Duck mapping script
            case proj_tokens.wildDuck:
              console.log(last_run_obj);
              break;

            // ****************************
            // Old North Gift Shop mapping script
            case proj_tokens.oldNorthGiftShop:
              console.log(last_run_obj);
              break;

            // ****************************
            // Uvida mapping script
            case proj_tokens.uvida:
              console.log(last_run_obj);
              break;

            default:
              break;
          }          
        } catch (e) {
          reject(e);
        }
    });
  });
}

module.exports = getParsehubData;