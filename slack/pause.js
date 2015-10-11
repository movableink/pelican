var PauseCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

PauseCommand = (function(superClass) {
  extend(PauseCommand, superClass);

  function PauseCommand() {
    return PauseCommand.__super__.constructor.apply(this, arguments);
  }

  PauseCommand.prototype.regex = /^pause|stop$/;

  PauseCommand.prototype.run = function(cb) {
    this.api.songs.pause();
    return cb(":pause: Paused");
  };

  return PauseCommand;

})(SlackCommand);

module.exports = PauseCommand;

//# sourceMappingURL=pause.js.map
