

function check_test(){
    console.log("It's working! :D");
    return "It's working really!";
}

function test_connect(){
    var port1 = new SerialPort('/dev/ttyUSB0', function (err) {
        if (err) {
            return console.log('Error:', err.message);
        } else {
            return console.log("Connected to USB0"); 
        }
    });

    var port2 = new SerialPort('/dev/tty.SLAB_USBtoUART', function (err) {
        if (err) {
            return console.log('Error:', err.message);
        } else {
            return console.log("Connect to SLAB_USB"); 
        }
    });
}

    





}