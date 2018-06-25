var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var util = require('util');
const ax25 = require('th-d72-ax25');
var myCallsign = "KM6TIG";
var mySSID = 1;

var sessions = {};

var packetResponse = "NO TEST";

console.log('TEST Loading Node index for: ' + myCallsign + '-' + mySSID);
console.log('Turn Kenwood THD72A On  and set to Packet 12 \n Pressing TNC');
 
var serialPort = new SerialPort('/dev/ttyUSB0', {
 baudRate: 9600
}); 


sendHelloPacket();

function setEcho() {
  var tnc = new ax25.kissTNC(
    {	serialPort : "/dev/ttyUSB0",
      baudRate : 9600
    }
  );

  tnc.on(
    "frame",
    function(frame) {
  
      var packet = new ax25.Packet();
      packet.disassemble(frame);
      if( packet.destinationCallsign != myCallsign
        ||
        packet.destinationSSID != mySSID
      ) {
        return;
      }
  
      console.log(packet.log());
  
      var clientID = util.format(
        "%s-%s-%s-%s",
        packet.sourceCallsign,
        packet.sourceSSID,
        packet.destinationCallsign,
        packet.destinationSSID
      );
  
      if(typeof sessions[clientID] == "undefined") {
  
        sessions[clientID] = new ax25.Session();
  
        sessions[clientID].on(
          "packet",
          function(frame) {
            console.log(frame.log());
            tnc.send(frame.assemble());
          }
        );
  
        sessions[clientID].on(
          "data",
          function(data) {
            sessions[clientID].sendString(
              util.format(
                "You sent: %s\r\n",
                ax25.Utils.byteArrayToString(data)
              )
            );
          }
        );
  
        sessions[clientID].on(
          "connection",
          function(state) {
            console.log(
              util.format(
                "Client %s-%s %s.",
                packet.sourceCallsign,
                packet.sourceSSID,
                (state) ? "connected" : "disconnected"
              )
            );
            if(!state)
              delete sessions[clientID];
          }
        );
  
        sessions[clientID].on(
          "error",
          function(err) {
            console.log(err);
          }
        );
  
      }
  
      if(typeof sessions[clientID] != "undefined")
        sessions[clientID].receive(packet);
  
    }
  
  );
  
  tnc.on(
    "error",
    function(err) {
      console.log("HURRRRR! I DONE BORKED! " + err);
    }
  );



}

// function setupSerialPort() {

//   // serialPort.on('data', function (data) {
//   //   console.log('Data:', data);
//   // });
  
//   // // Read data that is available but keep the stream from entering "flowing mode"
//   // serialPort.on('readable', function () {
//   //   console.log('Data:', port.read());
//   // });

//   serialPort.write('KISS ON \r\n', function(err) {
//     if (err) {
//       return console.log('Error on write: ', err.message);
//     }
//     console.log('KISS On');
//     setEcho();
//   });
// }

function sendHelloPacket() {

  var tnc = new ax25.kissTNC(
    {	'serialPort' : "/dev/ttyUSB0",
      'baudRate' : 9600
    }
  );
  
  var beacon = function() {
    var packet = new ax25.Packet(
      {	sourceCallsign : "MYCALL",
        destinationCallsign : "BEACON",
        type : ax25.U_FRAME_UI,
        infoString : "Hello world!"
      }
    );
    var frame = packet.assemble();
    tnc.send(frame);
    console.log("Beacon sent.");
  }
  
  tnc.on(
    "error",
    function(err) {
      console.log(err);
    }
  );
  
  tnc.on(
    "opened",
    function() {
      console.log("TNC opened on " + tnc.serialPort + " at " + tnc.baudRate);
      setInterval(beacon, 30000); // Beacon every 30 seconds - excessive!
    }
  );
  
  tnc.on(
    "frame",
    function(frame) {
      var packet = new ax25.Packet({ 'frame' : frame });
      console.log(
        util.format(
          "Packet seen from %s-%s to %s-%s.",
          packet.sourceCallsign,
          packet.sourceSSID,
          packet.destinationCallsign,
          packet.destinationSSID
        )
      );
      if(packet.infoString != "")
        console.log(packet.infoString);
    }
  );
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