var express = require('express');
var router = express.Router();
var SerialPort = require('serialport');
var util = require('util');
var ax25 = require('th-d72-ax25');
 
var myCallsign = "KM6TIG";
var mySSID = 1;

var sessions = {};

var packetResponse = "NO TEST";

console.log('TEST Loading Node index for:' + myCallsign);
console.log('Turn Kenwood THD72A On  and set to Packet 12 \n Pressing TNC');
 


router.get('/api/hello', (req, res) => {

  console.log('Hello ?');
  // device, baud_rate
  const tnc = new ax25.kissTNC(
    {	serialPort : "/dev/ttyUSB0",
      baudRate : 9600
    }
  );

  function h_send_string(str) {

    const packet = new ax25.Packet(modulo = 8);
    packet.type = ax25.Defs.U_FRAME_UI;
    packet.source = { callsign : 'KM6TIG', ssid : 1 };
    packet.destination = { callsign : 'KM6TIG', ssid : 2 };
    packet.payload == Buffer.from(str, 'ascii');
    tnc.send_data(packet.assemble(), () => console.log('Sent:', str));
  }
  h_send_string('hello no');
 
});

router.get('/api/packet', (req, res) => {
 
  console.log('TNC Starting....');
  // device, baud_rate
  const tnc = new ax25.kissTNC(
    {	serialPort : "/dev/ttyUSB0",
      baudRate : 9600
    }
  );

  function log_packet(data) {
    const packet = new ax25.Packet();
    packet.disassemble(data.data);
    console.log(`Packet received on port ${data.port}`);
    console.log('Destination:', packet.destination);
    console.log('Source:', packet.source);
    console.log('Type:', packet.type_name);
    if (packet.payload.length > 0) {
        console.log('Payload:', packet.payload.toString('ascii'));
    }
  }
  function send_string(str) {
    const packet = new ax25.Packet();
    packet.type = ax25.Defs.U_FRAME_UI;
    packet.sourceCallsign = 'KM6TIG'; 
    packet.destinationCallsign = 'KM6TIG'; 
    packet.sourceSSID = '1'; 
    packet.destinationSSID = '2'; 
    packet.infoString = 'Hello this is a test'; 
    tnc.send_data(packet.assemble(), () => console.log('Sent:', str));
  }

  tnc.send_string('Hello message')

  process.on('SIGTERM', tnc.close);
  tnc.on('error', console.log);
  tnc.on('data', log_packet);
  send_string('ehllo no');

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

function sendHello() {


  return "Testresponse";
}

function echoTNC() {
  var tnc = new ax25.kissTNC(
    {	serialPort : "/dev/ttyUSB0",
      baudRate : 9600
    }
  );

  
  var sessions = {};
  
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



module.exports = router;