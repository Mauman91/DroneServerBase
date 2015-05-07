var commands = require('./commands');

module.exports = function service(drone) {
  var ret = {};

  commands.forEach(function(command) {
    ret[command] = function() {
      drone[command].apply(drone, arguments);

      var cb = arguments[arguments.length - 1];
      cb();
    };
  });

  return ret;
};