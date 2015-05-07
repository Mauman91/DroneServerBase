var rpc = require('rpc-stream');
var net = require('net');
var arDrone = require('ar-drone');

var clientOptions = {
  ip: process.env.DRONE || '192.168.1.1'
};

var client = arDrone.createClient(clientOptions);

console.log('Drone client options: %j', clientOptions);

/// Command server

var service = require('./service');
var commandServer = net.createServer(handleCommandConnection);
var commandPort = Number(process.env.COMMAND_PORT) || 3001;
commandServer.listen(commandPort, function() {
  console.log('command server running on %j', commandServer.address());
});

function handleCommandConnection(conn) {
  var server = rpc(service(client));
  server.pipe(conn).pipe(server);
}

if (! process.env.NOVIDEO) {
  var video = require('./video');

  video(client);
}
