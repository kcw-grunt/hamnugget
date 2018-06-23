var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var util = require('util');
const ax25 = require('ax25');
 

router.get('/api/hello', (req, res) => {
  res.send({ response: 'World' });
});

router.get('/api/ham/status', (req, res) => {
  res.send({ response: 'HAM Sta...' });
});

router.get('/api/ham/tnc/on', (req, res) => {

  var tnc = new ax25.kissTNC(
    
  )
  tnc.on('frame', (frame) => { 
    res.send({response:console.log('src : ${packet.sourceCallsign}')});
    ////, dst : ${packet.destinationCallsign}, inf : ${packet.infoString}');
    //});
  });
  
  tnc.on('error', (err) => {
    console.log('ham nugget error' + err);
  });
});


router.get('/api/ham/connect', (req, res) => {
  var SerialPort = require('serialport');
  var port1 = new SerialPort('/dev/ttyUSB0', function (err) {
    if (err) {
        return console.log('Error:', err.message);
    } else {
        return console.log("Connected to USB0"); 
    }
  });

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hamsite' });
});

module.exports = router;