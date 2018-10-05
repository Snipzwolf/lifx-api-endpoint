#!/usr/bin/env node

const net = require('net');
const server = net.createServer();

const scenes = require('./scenes.js');
const LifxClientKlass = require('node-lifx').Client;
const lifxClient = new LifxClientKlass();

var lifxClientSettings = {
  startDiscovery: true,
  port: parseInt(process.env.LIFX_CLIENT_PORT)
};

if(typeof process.env.BULB_IPS !== 'undefined'){
  lifxClientSettings['lights'] = process.env.BULB_IPS.split(',');
}else{
  throw new Exception("No Lifx IPs Specified");
}

if(typeof process.env.LIFX_DEBUG !== 'undefined'){
  lifxClientSettings['debug'] = (process.env.LIFX_DEBUG.trim().toLowerCase() == 'true');
}

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
  console.log('current active lights:');
  activeLights.length === 0 ? console.log('None') : activeLights.map((light, idx) => console.log( light.address ));

  data = data.split(',');

  console.log('data is: %j', data);

  var execOnLights = activeLights.filter((light, idx) =>  data.length < 3 || light.address === data[2]);
  console.log('Executing on lights:');
  execOnLights.length === 0 ? console.log('None') : execOnLights.map((light, idx) => console.log( light.address ));

  switch(data[0]){
    case 'on':
    case 'off':
      execOnLights.map( (light, idx) => light[data[0]](2000, (error) => {
        if(error !== null)console.log(error);
      }));
    break;
    case 'scene':
      execOnLights.map( (light, idx) => light.color(...scenes[data[1]]) );
    break;
    default:
      console.error('Unknown command "' + data + '"');
  }
  //console.log(res);
  conn.write("done");
};

server.on('connection', handleConnection);
server.listen({
  host: process.env.LISTEN_HOST,
  port: process.env.LISTEN_PORT,
  callback: () => console.log('server listening to %j', server.address())
})
