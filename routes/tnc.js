var ind = require('./index');

const express = require('express');
const app = express();
const TNCRouter = express.Router();
var SerialPort = require('serialport');
var util = require('util');
const ax25 = require('th-d72-ax25');
var myCallsign = "KM6TIG";
var mySSID = 1;

var packetResponse = "NO TEST";

TNCRouter.route('/').get(function (req, res) {
  res.render('tnc',{cs:myCallsign,pr:packetResponse});
});


TNCRouter.post('/',function (req,res){
sendHelloPacket();  
  mySSID = mySSID + 4; 
var packetResponse = mySSID;//req.body.message;
var callsign = req.body.messagetext;
console.log(packetResponse);
console.log(callsign); 

res.render('tnc',{cs:callsign,pr:packetResponse});
});
// TNCRouter.route('/sendtext').post(function (req, res) {
//   mySSID = mySSID + 1;
// var packetmessage = 'This might be a real message: ' + mySSID;
//   res.render('tnc',{cs:myCallsign,pr:packetmessage});

// });

// router.post('/sendtext', function( req, res) {
//   mySSID = mySSID + 1;
//   console.log(mySSID);
// });



var sendHello = sendHelloPacket();

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

  module.exports = TNCRouter;