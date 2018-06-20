const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const config = require('../config');

let httpServer;

exports.initialize = function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    // CORS and Compression middleware
    app.use(cors());
    app.use(compression());

    // Combines logging into from request and response
    app.use(morgan('combined'));

    // Body parser middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    fs.readdirSync(path.join(__dirname, '../routes')).map(file => require(`../routes/${file}`)(app)); // eslint-disable-line

    httpServer.listen(config.server.port, err => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`Web API server is now listening on port ${config.server.port} in ${config.env} mode`);
      resolve();
    });
  });
};

exports.close = function close() {
  return new Promise((resolve, reject) => {
    httpServer.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};
