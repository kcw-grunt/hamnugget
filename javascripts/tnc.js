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

var sessions = {};

function tnctest() {
	console.log("It's working! TNC Test");
} 

function test_connect(){

    var port1 = new SerialPort('/dev/ttyUSB0', function (err) {
        if (err) {
            return console.log('Real Error:', err.message);
        } else {
            return console.log("Connected to USB0"); 
        }
    });

    port1.write('KISS ON \r\n');


}

 

