var SkipCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

SkipCommand = (function(superClass) {
  extend(SkipCommand, superClass);

  function SkipCommand() {
    return SkipCommand.__super__.constructor.apply(this, arguments);
  }

  SkipCommand.prototype.regex = /^skip/;

  SkipCommand.prototype.run = function(cb) {
    this.api.songs.shift();
    return cb(":next-track: Skipping track");
  };

  return SkipCommand;

})(SlackCommand);

module.exports = SkipCommand;

//# sourceMappingURL=skip.js.map
