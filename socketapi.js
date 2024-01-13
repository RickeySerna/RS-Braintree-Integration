var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

let nonceResolver;

io.on('connection', function(socket){
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

module.exports = socketapi;