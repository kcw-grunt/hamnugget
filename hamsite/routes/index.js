var express = require('express');
var router = express.Router();
const ax25 = require('ax25');

 
const tnc = new ax25.kissTNC({ serialPort : "/dev/ttyUSB0", baudRate : 9600 } );
tnc.on('frame', (frame) => { 
  let packet = new ax25.Packet({ frame : frame }); 
  console.log('src : ${packet.sourceCallsign}, dst : ${packet.destinationCallsign}, inf : ${packet.infoString}');
});

tnc.on('error', (err) => {
  console.log('error' + err);
});

router.get('/api/hello', (req, res) => {
  res.send({ response: 'World' });
});

router.get('/api/ham/status', (req, res) => {
  res.send({ response: 'HAM Connected' });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;