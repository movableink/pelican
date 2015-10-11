var DefaultList, HelpCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

DefaultList = require('../models/default_list.js');

HelpCommand = (function(superClass) {
  extend(HelpCommand, superClass);

  function HelpCommand() {
    return HelpCommand.__super__.constructor.apply(this, arguments);
  }

  HelpCommand.prototype.regex = /^help/;

  HelpCommand.prototype.run = function(cb) {
    var msg;
    msg = "*Jukebox Help:*\n`https://www.youtube.com/watch?v=XXXXXX` : add a song to the queue to be played\n`queue` : show the current queue\n`pause` / `unpause` : pause and unpause the currently playing track\n`skip` : skip to the next track\n`default https://www.youtube.com/playlist?list=XXXXXXXX 5` : when there are no songs queued by users, start pulling songs from the specified playlist URL, starting with the 5th song\n`clear default playlist` : no default playlist, when queue end is reached songs will stop";
    return cb(msg);
  };

  return HelpCommand;

})(SlackCommand);

module.exports = HelpCommand;

//# sourceMappingURL=help.js.map
