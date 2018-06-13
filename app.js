const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.send('http://localhost:3000/index.html');
});

app.listen(3000, () => console.log('Listening on port 3000...'));

// // Connection URL
// const url = 'mongodb://localhost:27017';

// // Database Name
// const dbName = 'myproject';

// // Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//   console.log('Connected successfully to server');

//   const db = client.db(dbName);

//   client.close();
// });