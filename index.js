var rpc = require('rpc-stream');
var net = require('net');
var arDrone = require('ar-drone');

/// Command server

var service = require('./service');
var commandServer = net.createServer(handleCommandConnection);
var commandPort = Number(process.env.COMMAND_PORT) || 4000;
commandServer.listen(commandPort, function() {
  console.log('command server running on %j', commandServer.address());
});

function handleCommandConnection(conn) {
  var client  = arDrone.createClient();
  var server = rpc(service(client));
  server.pipe(conn).pipe(server);
}


/// Video server

var videoServer = net.createServer(handleVideoConnection);
var videoPort = Number(process.env.VIDEO_PORT) || 4001;
videoServer.listen(videoPort, function() {
  console.log('video server running on %j', videoServer.address());
});

function handleVideoConnection(conn) {
  console.log('new video client');
  var client  = arDrone.createClient();
  var video = client.getVideoStream();
  video.pipe(conn);

  conn.once('close', function() {
    console.log('closing video client...');
    video.end();
  });
}
