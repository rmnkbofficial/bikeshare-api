var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
require('dotenv').config();

var authRouter = require('./routes/auth');
var stationRouter = require('./routes/api/station');
var tripRouter = require('./routes/api/trip');

var app = express();
const helper = require('./routes/helpers');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/station', stationRouter);
app.use('/trip', tripRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

helper
  .initDictionary()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
    });
  })
  .catch((e) => {
    console.log('Something went wrong initializing the dictionary.', e);
  });

module.exports = app;
