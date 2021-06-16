#!/usr/local/bin/node

const express = require('express');
const { MongoClient } = require('mongodb');
const getParsehubData = require('./getParsehubData');
const proj_tokens = require('./projectTokens');
const scheduleRun = require('./scheduleRun');

let normalizedObj = {};

// getParsehubData(proj_tokens.knitHappens).then((result)=>{
//   normalizedObj = result;
//   console.log(normalizedObj);
// }).catch((err)=> {
//   console.log(err);
// })

// mongodb connection
// async function mongodbConnect(){
//   const uri = "mongodb+srv://Kevin:uBb7KFTPi84P5mdI@dataintake.s1fpi.mongodb.net/test";
//   const client = new MongoClient(uri);

//   try {
//     // Connect to the MongoDB cluster
//     await client.connect();
//     const database = client.db('parsehub');
//     const collection = database.collection('scraped-parsehub-data');

//     // insert new normalized objects to collection
//     const result = await collection.insertMany(normalizedObj);

//   } catch (e) {
//       console.error(e);
//   } finally {
//       await client.close();
//   }
// }

// mongodbConnect().catch(console.error);


// scheduleRun(proj_tokens.knitHappens);

// express server setup
const app = express();
const port = 8000;

// webhook
app.use(express.json());
// app.use(express.urlencoded({
//   extended: true
// }));
app.post("/", (req, res) => {
  console.log(req.body) // Call your action on the request here
                        // this is where the getParsehubData() fn will go
  res.status(200).end() // Responding is important
})

app.listen(port, () => {
  console.log(`Parsehub API script listening at http://localhost:${port}`)
  return;
})