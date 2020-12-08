const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const cors = require('cors')
const products = require('./db');
const { v4: uuidv4 } = require('uuid');


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log(products);

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});

app.get('/', (_, res) => {
  res.send({ status: 200 });
});

app.post('/createproduct', (req, _) => {
  const name = req.body.name;
  const category = req.body.category;
  const price = req.body.price;

  const newEntry = {
    id: uuidv4(),
    name,
    category,
    price
  };

  const entry = JSON.stringify([...products, newEntry], null, 2); 
  const newData = `const products = 
    ${entry};\n
  module.exports = products;`;
  
  fs.writeFileSync('db.js', newData);
});

process.on('SIGINT', function () {
  process.exit();
});
