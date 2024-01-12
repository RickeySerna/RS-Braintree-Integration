var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

// Array that'll be filled with the socket IDs for the specific sockets.
// That'll be used know which specific socket we're emitting to in sendNonce().
io.mySockets = {};
let nonceResolver;

io.on('connection', function(socket){
/*    socket.on('page', function(page){
        io.mySockets[page] = socket.id;
    });*/

    socket.on('nonce-send-to-server', (new3DSNonce) => {
        console.log("Nonce received from client in socketapi.js: " + new3DSNonce);
        nonceResolver && nonceResolver(new3DSNonce);
    });
});

socketapi.returnNonce = function() {
    return new Promise((resolve, reject) => {
        nonceResolver = resolve;
    });
}

socketapi.sendNonce = function(nonce, bin) {
    io.sockets.emit('nonce-send', nonce, bin);
}
/*
socketapi.sendNonce = function(nonce, bin, socketId) {
    io.to(socketId).emit('nonce-send', nonce, bin);
}*/

module.exports = socketapi;