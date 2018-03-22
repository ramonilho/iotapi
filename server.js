var express = require('express');
var five = require('johnny-five');

var app = express();
var led;
var celsiusTemp = "0°C";

// Registering Arduino Board
var board = new five.Board({ port: '/dev/cu.usbmodem1421' });
// **** = denotes system specific enumeration value (ie. a number)

// Registering board inputs
board.on("ready", function() {
    // LED
    led = new five.Led(13);

    // LM35 - Thermomether
    var temperature = new five.Thermometer({
        controller: "LM35",
        pin: "A0"
    });

    temperature.on("change", function() {
        celsiusTemp = this.celsius + "°C";
        console.log("LM35 ::: " + celsiusTemp);
    });
});

// Turn led ON
app.post('/api/led/on', function(req, res) {
    led.on();

    message = 'Led is on';
    res.send(message);
    console.log(message);
});

// Blink led
app.post('/api/led/blink', function(req, res) {
    led.blink(500);
    
    message = 'Led is blinking';
    res.send(message);
    console.log(message);
});

// Turn led OFF
app.post('/api/led/off', function(req, res) {
    led.off();

    message = 'Led is off';
    res.send(message);
    console.log(message);
});

app.get('/api/therm', function(req, res) {
    res.send(celsiusTemp);
    console.log(celsiusTemp);
});


// Runs server
app.listen(3000, function() {
    console.log('Server is listening');
});

// Commands to get usb number:
// mac: ioreg -p IOUSB -w0 -l
// system_profiler SPUSBDataType