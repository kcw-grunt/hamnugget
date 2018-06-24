var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var util = require('util');
const ax25 = require('ax25');
 
var myCallsign = "KM6TIG";
var mySSID = 1;

var sessions = {};

var packetResponse = "NO TEST";

console.log('TEST Loading Node index for:' + myCallsign);
console.log('Turn Kenwood THD72A On  and set to Packet 12 \n Pressing TNC');
 
var serialPort = new SerialPort('/dev/ttyUSB0', {
 baudRate: 9600
}); 


setupSerialPort();

function setupSerialPort() {

  serialPort.on('data', function (data) {
    console.log('Data:', data);
  });
  
  // Read data that is available but keep the stream from entering "flowing mode"
  serialPort.on('readable', function () {
    console.log('Data:', port.read());
  });

  serialPort.write('ECHO ON \r\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Echo On');
  });

  serialPort.write('KISS ON \r\n', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('KISS On');
  });
}

 
  
router.get('/api/hello', (req, res) => {
  res.send({ response: 'World' });
});

router.get('/api/ham/status', (req, res) => {
  res.send({ response: 'HAM Sta...' });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hamsite',mycall: myCallsign, packetResponse: packetResponse});
});

/* POST . */
router.post('/', function (req, res) {
  console.log(req.body.message);

  var status = serialPort.isOpen;
  if (status) {
    serialPort.write(req.body.message, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('Message Sent');
    });
  }
  console.log(req.body.callsign);
});





module.exports = router;