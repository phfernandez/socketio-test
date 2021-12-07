
const fs = require('fs');
const express = require('express');
const app = express();
const https = require('https');

//const { Server } = require("socket.io");
//const io = new Server(server);


//const privateKey = fs.readFileSync(process.env.PRIVATE_KEY, 'utf8')
//const certificate = fs.readFileSync(process.env.CERTIFICATE, 'utf8')
const privateKey = fs.readFileSync('./file.pem', 'utf8')
const certificate = fs.readFileSync('./file.crt', 'utf8')
const credentials = {
    key: privateKey, 
    cert: certificate, 
    passphrase: process.env.PASSPHRASE
}

//const credentials = {}

const server = https.createServer(credentials, app);

const io = require("socket.io")(server, {
  cors: {
    //origin: "http://192.168.1.2", // Local
    //origin: "https://www.eteria-desarrollo.com",
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//var ip = '192.168.0.2';
//var port = 10014;
//var ip = "172.24.2.60";
//var port =  10014;

//const ip = "82.98.178.187";
const port =  12726;
//const port =  0;
//const port =  3000;


// --------------------------------------------------------------------------------------------------------
// Config socket.io
// --------------------------------------------------------------------------------------------------------
/*
//io.set('log level', 1);
io.configure(function () {
  io.set('flash policy port', -1);
  io.set('transports', [
      'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
});
*/


// --------------------------------------------------------------------------------------------------------
// Manage crossdomain request with "expressjs" to this server:port
// (You need to copy a valid crossdomain.xml file in the same folder of this server script)
// --------------------------------------------------------------------------------------------------------
app.get('/crossdomain.xml', function (req, res) {
  console.log("request ... " + __dirname);
  res.sendfile(__dirname + '/crossdomain.xml');
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});

console.log("socket.io server started");


// --------------------------------------------------------------------------------------------------------
// Manage sockets communication
// --------------------------------------------------------------------------------------------------------
io.sockets.on('connection', function (socket) {

  console.log("Connection " + socket.id + " accepted.");

  socket.on('message', function (msg) {
    console.log('Message: ' + msg + ' from client: ' + socket.id);

    //socket.emit('message', { param1: 'Hello client, Im the server!' }); // Envia solo al socket
    socket.broadcast.emit('message', { msg: msg }); // Envia a todos menos al que lo envia
    //io.sockets.emit('message', { msg: msg }); // Envia a todos
  });

  // Custom event
  socket.on('my other event', function (msg) {
    console.log('my other event: ' + msg + ' from client: ' + socket.id);
    //socket.emit('message', { param1: 'Hello client, Im the server!' }); // Envia solo al socket
    io.sockets.emit('my other event', { param1: 'The server received custom event: "my other event"' }); // Envia a todos
  });

  socket.on('disconnect', function () {
    console.log("Connection " + socket.id + " terminated.");
    //io.sockets.emit('message', { msg: '<Usuario desconectado>' });
  });

});
