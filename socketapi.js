var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
});

socketapi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

module.exports = socketapi;