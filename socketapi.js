var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

let noncePromise = new Promise((resolve, reject) => {
    io.on('connection', function(socket){
        socket.on('nonce-send-to-server', (nonce) => {
            console.log("Nonce received from client in socketapi.js: " + nonce);
            resolve(nonce);
        });
    });
});

socketapi.returnNonce = function() {
    return noncePromise;
}

socketapi.sendNotification = function() {
    io.sockets.emit('hello', {msg: 'Hello World!'});
}

socketapi.sendNonce = function(nonce) {
    io.sockets.emit('nonce-send', nonce);
}

socketapi.receiveNonce = function(socket) {
    io.sockets.emit('nonce-send', nonce);
}

module.exports = socketapi;