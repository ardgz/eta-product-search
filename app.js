const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const csv = require('fast-csv');
const path = require('path');

const URL = 'mongodb://localhost:27017';
const DBNAME = 'etaProductSearch';
const COLLECTION = 'products';

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (request, response) => {
  response.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/', (request, response) => {
  let jsonRequest = request.body;
  const criteria = jsonRequest.criteria;
  const query = jsonRequest.query;
  searchDatabase(query, criteria).then((results) => {
    jsonString = JSON.stringify(results);
    response.json(jsonString);
  });
 
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
  createDatabaseFromCsv(URL, DBNAME, COLLECTION);
});

function createDatabaseFromCsv(url, dbName, collection) {
  let csvData = [];
  csvData = parseCsv();
  csvData.then((data) => {
    MongoClient.connect(url, function(err, client) {
      const db = client.db(dbName);
      console.log('Successfully connected to MongoDB Database');
      console.log(data);

      // Drop an existing collection if it exists, then create a new one after
      db.dropCollection(collection).then(() => {
        db.createCollection(collection).then((col) => {
          col.insertMany(data).then((result) => {
            client.close();
          });
        });
      });
    });
  });
}

function parseCsv() {
  return new Promise((resolve, reject) => {
    let results = [];
    csv.fromPath("inputData.csv", {headers: true, trim: true, strictColumnHandling: true})
      .on("data", (data) => {
        results.push(data);
      })
      .on("error", (data) => {
        console.log('PROBLEM LINE!');
        console.log(data);
      })
      .on("end", () => {
        resolve(results);
      });
    });  
}

function searchDatabase(query, criteria) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(URL, function(err, client) {
      const db = client.db(DBNAME);
      const collection = db.collection(COLLECTION);
      let searchObject = {};
  
      searchObject[criteria] = query;
      
      collection.find(searchObject).toArray().then((results) => {
        client.close();
        resolve(results);
      });
    });
  });
}