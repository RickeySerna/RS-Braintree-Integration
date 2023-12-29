var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

var newNonceFromVerifyCard = "foo";

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('nonce-send-to-server', (nonce) => {
        newNonceFromVerifyCard = nonce;
        console.log("Nonce returned to server: " + newNonceFromVerifyCard);
        alertNonce(newNonceFromVerifyCard)
    });
});

alertNonce(newNonceFromVerifyCard);

function alertNonce (n) {
    console.log(n);
}

socketapi.returnNonce = function() {
    console.log("Nonce value returned in returnNonce(): " + newNonceFromVerifyCard)
    return newNonceFromVerifyCard;
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