var socket_io = require('socket.io');
var io = socket_io();
var socketapi = {};

socketapi.io = io;

/*let noncePromise;

io.on('connection', function(socket){
    socket.on('nonce-send-to-server', (nonce) => {
        console.log("Nonce received from client in socketapi.js: " + nonce);
        noncePromise && noncePromise.resolve(nonce);
    });
});

socketapi.returnNonce = function() {
    noncePromise = new Promise((resolve, reject) => {
        noncePromise.resolve = resolve;
    });
    return noncePromise;
}*/

let nonceResolver;

io.on('connection', function(socket){
    socket.on('nonce-send-to-server', (nonce) => {
        console.log("Nonce received from client in socketapi.js: " + nonce);
        nonceResolver && nonceResolver(nonce);
    });
});

socketapi.returnNonce = function() {
    return new Promise((resolve, reject) => {
        nonceResolver = resolve;
    });
}

/*
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
*/

socketapi.sendNonce = function(nonce, bin) {
    io.sockets.emit('nonce-send', nonce, bin);
}

module.exports = socketapi;