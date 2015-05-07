var PaVEParser = require('./PaVEParser');
var ffmpeg = require('./ffmpeg');

module.exports = function (client) {
    // init ffmpeg
  ffmpeg(function(err, ffmpeg) {
    if (err) { throw err; }
    // get the pngs from teh drone
    var video = client.getVideoStream();
    var parser = new PaVEParser();
    video.pipe(parser);
    parser.pipe(ffmpeg.stdin);
  })
}