const http = require('http');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const webServerConfig = require('../config/web-server');
const router = require('./router');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    httpServer = http.createServer(app);

    // Combines logging into from request and response
    app.use(morgan('combined'));

    // Body parser middleware
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Mount the router at /api so all its routes start with /api
    app.use('/api', router);

    httpServer.listen(webServerConfig.port, err => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`Web server listening on localhost:${webServerConfig.port}`);
      resolve();
    });
  });
}

module.exports.initialize = initialize;

function close() {
  return new Promise((resolve, reject) => {
    httpServer.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

module.exports.close = close;
