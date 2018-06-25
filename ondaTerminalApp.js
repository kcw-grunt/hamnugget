var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var ondaTerminalApp = express();

var indexRouter = require('./routes/index');
var tncRouter = require('./routes/tnc');

ondaTerminalApp.use('/index', indexRouter);
ondaTerminalApp.use('/tnc', tncRouter);



// view engine setup
ondaTerminalApp.set('views', path.join(__dirname, 'views'));
ondaTerminalApp.engine('html', require('ejs').renderFile);
ondaTerminalApp.set('view engine', 'html');

ondaTerminalApp.use(logger('dev'));
ondaTerminalApp.use(express.json());
ondaTerminalApp.use(express.urlencoded({ extended: false }));
ondaTerminalApp.use(cookieParser());

ondaTerminalApp.use(express.static(path.join(__dirname, 'public')));

ondaTerminalApp.use('/', indexRouter);


// catch 404 and forward to error handler
ondaTerminalApp.use(function(req, res, next) {
  next(createError(404));
});

// error handler
ondaTerminalApp.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


ondaTerminalApp.get('/tnc', function(req, res) {
  var station = 'hello KM6TIG';
  res.render(__dirname + "/views/tnc.html", {station:station});
});


ondaTerminalApp.post('/tnc', function(req, res){ 
  console.log('After post');
});



module.exports = ondaTerminalApp;



