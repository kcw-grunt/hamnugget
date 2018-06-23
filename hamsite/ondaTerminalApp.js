var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var ondaTerminalApp = express();

// view engine setup
ondaTerminalApp.set('views', path.join(__dirname, 'views'));
ondaTerminalApp.set('view engine', 'jade');

ondaTerminalApp.use(logger('dev'));
ondaTerminalApp.use(express.json());
ondaTerminalApp.use(express.urlencoded({ extended: false }));
ondaTerminalApp.use(cookieParser());

ondaTerminalApp.use(express.static(path.join(__dirname, 'public')));

ondaTerminalApp.use('/', indexRouter);


// Get the Javascript in the browser
ondaTerminalApp.use("/javascripts", express.static("./outJavascripts"));
// Get the URL
ondaTerminalApp.all("/", function(req, res){
  // Render the Jade and Send for the client (Browser)
  req.render("index.jade");
});


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

// ondaTerminalApp.get('/api/send_packet/:text', (req, res) => { 
//   let packet = new ax25.Packet({ sourceCallsign : 'mycall', sourceSSID : 0, 
//                             destinationCallsign : 'mycall', destinationSSID : 1, 
//                             type : ax25.Defs.U_FRAME_UI, 
//                             infoString : req.params.text }); 
//   tnc.send(packet.assemble()); 
//   res.json({ ok : true }); 
// });

ondaTerminalApp.get('/api/ham/send_packet/:text', (req, res) => {
  let isWorking = false;
  res.json(isWorking);
});


module.exports = ondaTerminalApp;



