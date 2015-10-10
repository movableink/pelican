var SlackCommand, UnpauseCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

UnpauseCommand = (function(superClass) {
  extend(UnpauseCommand, superClass);

  function UnpauseCommand() {
    return UnpauseCommand.__super__.constructor.apply(this, arguments);
  }

  UnpauseCommand.prototype.regex = /^(play|unpause)$/;

  UnpauseCommand.prototype.run = function(cb) {
    this.io.sockets.emit('unpause');
    return cb(":play: Unpaused");
  };

  return UnpauseCommand;

})(SlackCommand);

module.exports = UnpauseCommand;

//# sourceMappingURL=unpause.js.map
