const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const cors = require('cors')
const products = require('./db');
const { v4: uuidv4 } = require('uuid');
const { nextTick } = require('process');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});


/***************** GET *****************/
app.get('/', (_, res) => {
  res.send({ status: 200 });
});

app.get('/products', (req, res) => {
  const results = Object.entries(products);
  const limit = 24;
  
  // example search: http://localhost:3001/products?page=1&category=greens&minPrice=200&maxPrice=400
  const page = parseInt(req.query.page) || 1; 
  const category = req.query.category; 
  const minPrice = parseInt(req.query.minPrice) || 0; 
  const maxPrice = parseInt(req.query.maxPrice) || 9999; 

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit; 
  
  const sort = products.reduce((res, cVal) => {
    if (cVal.category === category && cVal.price >= minPrice && cVal.price <= maxPrice) {
      res.push(cVal);
    }
    return res;
  }, []);

  const sortedResult = Object.entries(sort).slice(startIndex, endIndex);
  res.send({ status: 200, page, category, minPrice, maxPrice, sortedResult });
})

/***************** POST *****************/
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
  res.send({ status: 201, message: 'Listing Created' });
});

process.on('SIGINT', function () {
  process.exit();
});
