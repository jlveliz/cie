const SERVER_PORT = 8000
var fs = require('fs')
var https = require('https')
var express = require('express')
var app = express()

var options = {
    key: fs.readFileSync('C:/wamp/bin/apache/apache2.4.18/OpenSSL/certs/portal.key'),
    cert: fs.readFileSync('C:/wamp/bin/apache/apache2.4.18/OpenSSL/certs/portal.crt'),
}

var server = https.createServer(options, app)
var io = require('socket.io').listen(server)
var redis = require('redis')
var ioredis = require('socket.io-redis')
    // Multi-server socket handling allowing you to scale horizontally 
    // or use a load balancer with Redis distributing messages across servers.
io.adapter(ioredis({ host: 'localhost', port: 6379 }))



/*
 * Server
 */

// Start listening for incoming client connections
io.sockets.on('connection', function(socket) {

    /*
     * Redis pub/sub
     */

    // Listen to local Redis broadcasts
    var accessUserLog = redis.createClient();
    accessUserLog.subscribe('user.access');
    // Handle messages from channels we're subscribed to
    accessUserLog.on('message', function(channel, payload) {
        payload = JSON.parse(payload)
        socket.emit(channel, payload);
    })



     // Listen to local Redis broadcasts
    var systemAccLog = redis.createClient();
    systemAccLog.subscribe('system.log');
    // Handle messages from channels we're subscribed to
    systemAccLog.on('message', function(channel, payload) {
        payload = JSON.parse(payload)
        socket.emit(channel, payload);
    })

    // Listen to local Redis broadcasts
    var tokenExpired = redis.createClient();
    tokenExpired.subscribe('token.expired');
    // Handle messages from channels we're subscribed to
    tokenExpired.on('message', function(channel, message) {
        socket.emit(channel, message);
    })



    socket.on('disconnect', function() {
        console.log('DISCONNECT')
    })

})

// Start listening for client connections
server.listen(SERVER_PORT, function() {
    console.log('Listening to incoming client connections on port ' + SERVER_PORT)
})
