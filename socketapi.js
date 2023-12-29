var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

var newNonceFromVerifyCard = "foo";

/*

io.on('connection', function(socket){
    console.log('A user connected');
    socket.on('nonce-send-to-server', (nonce) => {
        newNonceFromVerifyCard = nonce;
        console.log("Nonce returned to server: " + newNonceFromVerifyCard);
    });
});

socketapi.returnNonce = function() {
    console.log("Nonce value returned in returnNonce(): " + newNonceFromVerifyCard)
    return newNonceFromVerifyCard;
}
*/

let noncePromise = new Promise((resolve, reject) => {
    io.on('connection', function(socket){
        socket.on('nonce-send-to-server', (nonce) => {
            console.log("Nonce returned to server: " + nonce);
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