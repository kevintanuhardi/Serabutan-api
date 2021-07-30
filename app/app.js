/* global Helpers */
const cors = require('cors');
const express = require('express');
const enrouten = require('express-enrouten');
const cuid = require('cuid');
const fileUpload = require('express-fileupload');

const middleware = require('./middlewares');

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

// Authentication Middleware
app.use('/', middleware.auth.validateToken);

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
app.use((err, req, res, next) => Helpers.errorResponse(res, null, err));

module.exports = app;
