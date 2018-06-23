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
  // var SerialPort = require('serialport');
  // var port1 = new SerialPort('/dev/ttyUSB0', function (err) {
  //   if (err) {
  //       return console.log('Error:', err.message);
  //   } else {
  //       return console.log("Connected to USB0"); 
  //   }
  // });

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

});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hamsite' });
});

module.exports = router;