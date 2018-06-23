//ax25 = require("./index");
//util = require("util");

var myCallsign = "KM6TIG";
var mySSID = 2;
var tnc = new ax25.kissTNC(
	{	serialPort : "/dev/ttyUSB0",
		baudRate : 9600
	}
);

var sessions = {};


function test_console(){
    console.log("It's working! :D");
}

function test_connect(){
    console.log("Connect!!!!!!"); 
}



var sessions = {};

function tnctest() {
	console.log("It's working! TNC Test");
} 
 
// tnc.on(
// 	"frame",
// 	function(frame) {

// 		var packet = new ax25.Packet();
// 		packet.disassemble(frame);
// 		if( packet.destinationCallsign != myCallsign
// 			||
// 			packet.destinationSSID != mySSID
// 		) {
// 			return;
// 		}

// 		console.log(packet.log());

// 		var clientID = util.format(
// 			"%s-%s-%s-%s",
// 			packet.sourceCallsign,
// 			packet.sourceSSID,
// 			packet.destinationCallsign,
// 			packet.destinationSSID
// 		);

// 		if(typeof sessions[clientID] == "undefined") {

// 			sessions[clientID] = new ax25.Session();

// 			sessions[clientID].on(
// 				"packet",
// 				function(frame) {
// 					console.log(frame.log());
// 					tnc.send(frame.assemble());
// 				}
// 			);

// 			sessions[clientID].on(
// 				"data",
// 				function(data) {
// 					sessions[clientID].sendString(
// 						util.format(
// 							"You sent: %s\r\n",
// 							ax25.Utils.byteArrayToString(data)
// 						)
// 					);
// 				}
// 			);

// 			sessions[clientID].on(
// 				"connection",
// 				function(state) {
// 					console.log(
// 						util.format(
// 							"Client %s-%s %s.",
// 							packet.sourceCallsign,
// 							packet.sourceSSID,
// 							(state) ? "connected" : "disconnected"
// 						)
// 					);
// 					if(!state)
// 						delete sessions[clientID];
// 				}
// 			);

// 			sessions[clientID].on(
// 				"error",
// 				function(err) {
// 					console.log(err);
// 				}
// 			);

// 		}

// 		if(typeof sessions[clientID] != "undefined")
// 			sessions[clientID].receive(packet);

// 	}

// );

// tnc.on(
// 	"error",
// 	function(err) {
// 		console.log("HURRRRR! I DONE BORKED! " + err);
// 	}
// );


