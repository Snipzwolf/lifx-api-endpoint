#!/usr/bin/env node

const net = require('net');
const server = net.createServer();

const scenes = require('./scenes.js');
const LifxClientKlass = require('node-lifx').Client;
const lifxClient = new LifxClientKlass();

var lifxClientSettings = {
  startDiscovery: true,
  debug: true,
  lights: process.env.BULB_IPS.split(',')
};

if(typeof process.env.BROADCAST_NETWORK !== 'undefined'){
  lifxClientSettings['address'] = process.env.BROADCAST_NETWORK;
}

console.log('LISTEN_PORT: %s\nLifx Client Settings: %j', process.env.LISTEN_PORT, lifxClientSettings);

lifxClient.init(lifxClientSettings);

const handleConnection = function(conn) {
  var remoteAddress = conn.remoteAddress + ':' + conn.remotePort;
  console.log('new client connection from %s', remoteAddress);

  conn.setEncoding('utf8');
  conn.on('data', (data) => onConnData(data.trim().toLowerCase(), remoteAddress, conn));
  conn.once('close', (had_error) => onConnClose(had_error, remoteAddress));
  conn.on('error', (err) => onConnError(err, remoteAddress));
};

const onConnClose = function(had_error, remoteAddress) {
  console.log('connection from %s closed', remoteAddress);
};

const onConnError = function(err, remoteAddress) {
  console.log('Connection %s error: %s', remoteAddress, err.message);
};

const onConnData = function(data, remoteAddress, conn) {
  console.log('connection data from %s: %j', remoteAddress, data);

  var activeLights = lifxClient.lights();
  console.log('current active lights: %j', activeLights);

  data = data.split(',');

  switch(data[0]){
    case 'on':
    case 'off':
      activeLights.map( (light, idx) => light[data](2000) );
    break;
    case 'scene':
      activeLights.map( (light, idx) => {
        light.color(...scenes[data[1]]);
      });
    break;
    default:
      console.error('Unknown command "' + data + '"');
  }
  //console.log(res);
  conn.write("done");
};

server.on('connection', handleConnection);
server.listen(process.env.LISTEN_PORT, function() {
  console.log('server listening to %j', server.address());
});
