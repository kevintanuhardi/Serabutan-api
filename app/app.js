const cors = require('cors');
const express = require('express');
const enrouten = require('express-enrouten');
const cuid = require('cuid');
// const multer = require('multer');
const fileUpload = require('express-fileupload');

// const upload = multer();

global.Helpers = require('./helpers/common');

const app = express();
app.use(cors());
// global.CustomStatusCode = require('./helpers/enum').customStatusCode;

// app.use(expressValidator());

// Embedd RequestId
app.use((req, res, next) => {
  req.requestId = cuid();
  next();
});

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());

// Logger
app.set('etag', false);

// Routing
app.use('/', enrouten({ directory: 'routes' }));

// Not Found handler
/* eslint-disable no-unused-vars */
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Resource not found.',
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json(err);
});

module.exports = app;
