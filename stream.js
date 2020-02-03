//process.env.OPENCV4NODEJS_DISABLE_EXTERNAL_MEM_TRACKING = 1
const express = require('express');
const app = express();
const os = require('os');
const path = require('path');
const server = require('http').Server(app);
const io = require ('socket.io')(server);
const async = require("async");
// const cv = require('opencv4nodejs')
// const VCap = new cv.VideoCapture(0);
const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
//const { spawn } = require('child_process');

function listPorts() {
    SerialPort.list().then(
     ports => {
      ports.forEach(port => {
       console.log(`${port.path}`);
       console.log(`${port.pnpId}`);
       console.log(`${port.manufacturer}`);
       
      })
     },
     err => {
      console.error('Error listing ports', err)
     }
    )
   }

   listPorts()

const device = '/dev/tty.usbmodem1433301';  // ls -lha /dev/tty*
const serialPort = new SerialPort(device, function (err) {
    if (err) {
      return console.log(err.message)
    }
    else{
        console.log('Serial communication is ON with ',device);
    }
    baudRate: 57600
  })
  
const parser = new Readline()
serialPort.pipe(parser)
const lineStream = serialPort.pipe(new Readline())

// parser.on('data', function (data) {
//   console.log('data received: ' + data)
// })

app.get('/', (req , res ) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/test', (req , res ) => {
        var serialData = JSON.stringify(lineStream._readableState.buffer.head.data);
        console.log(JSON.stringify(lineStream._readableState.buffer.head.data));
        console.log({"text":serialData});
        res.send(serialData);   
        res.end(); 
})

app.get('/data', (req , res ) => {
    var gpsData = {'text':'Data send from test API !'}
        res.send(gpsData);   
        res.end(); 
})

// setInterval(() =>{
//     parser.on('data', function (data) {
//         //console.log('data received: ' + data)
//         io.emit('live', data);
//       })
    
// }, 2000 )


// setInterval(() =>{
//     const frame = VCap.read();
//     const image = cv.imencode('.jpg', frame).toString('base64');
//     io.emit('live', image);
// }, 1000 )



server.listen(3500)

console.log("Stream Server started !");
