var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

var newNonceFromVerifyCard = "";

function addToNonceArray (n) {
    newNonceFromVerifyCard = n;
}

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('nonce-send-to-server', (nonce) => {
        addToNonceArray(nonce);
        console.log("zzzzzzzzzzzzzzzzz: " + newNonceFromVerifyCard);
    });
});

socketapi.returnNonce = function() {
    console.log("testing123: " + newNonceFromVerifyCard)
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