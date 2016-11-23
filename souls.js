const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');

const port = process.env.PORT || 1254;
/**
 * Souls - Personalized Users
 * @module  souls
 */

console.log('Searching for souls...');

const app = express();

app.use(morgan('development' === process.env.NODE_ENV ? 'dev' : 'combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/templates/index.html`));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});