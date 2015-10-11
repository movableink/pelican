var ClearDefaultPlaylistCommand, DefaultList, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

DefaultList = require('../models/default_list.js');

ClearDefaultPlaylistCommand = (function(superClass) {
  extend(ClearDefaultPlaylistCommand, superClass);

  function ClearDefaultPlaylistCommand() {
    return ClearDefaultPlaylistCommand.__super__.constructor.apply(this, arguments);
  }

  ClearDefaultPlaylistCommand.prototype.regex = /(no|clear) default playlist/;

  ClearDefaultPlaylistCommand.prototype.run = function(cb) {
    DefaultList.current = null;
    return cb("Cleared default playlist.");
  };

  return ClearDefaultPlaylistCommand;

})(SlackCommand);

module.exports = ClearDefaultPlaylistCommand;

//# sourceMappingURL=clear_default_playlist.js.map
