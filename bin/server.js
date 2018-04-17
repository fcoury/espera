#!/usr/bin/env nodemon
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const Server = require('../src');
new Server(app).addRoutes();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}!`);
});
