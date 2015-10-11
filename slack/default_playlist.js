var DefaultList, DefaultPlaylistCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

DefaultList = require('../models/default_list.js');

DefaultPlaylistCommand = (function(superClass) {
  extend(DefaultPlaylistCommand, superClass);

  function DefaultPlaylistCommand() {
    return DefaultPlaylistCommand.__super__.constructor.apply(this, arguments);
  }

  DefaultPlaylistCommand.prototype.regex = /youtube\.com\/playlist\?list=([^&>]+)/;

  DefaultPlaylistCommand.prototype.run = function(cb) {
    var id, list, match, ref, songIndex;
    match = this.text.match(this.regex);
    id = match[1];
    if (!id) {
      return;
    }
    songIndex = (ref = this.text.match(/\s(\d+)$/)) != null ? ref[1] : void 0;
    if (songIndex) {
      songIndex = parseInt(songIndex) - 1;
    }
    list = new DefaultList({
      listId: id,
      songIndex: songIndex || 0
    });
    return list.fetch({
      success: (function(_this) {
        return function(model) {
          cb("Pulling songs from \"" + (model.get('title')) + "\" (" + (model.get('songs').length) + " tracks) when nothing else is queued");
          DefaultList.current = model;
          if (_this.api.songs.length === 0) {
            return _this.api.songs.next();
          }
        };
      })(this),
      error: function(model) {
        return console.error(model);
      }
    });
  };

  return DefaultPlaylistCommand;

})(SlackCommand);

module.exports = DefaultPlaylistCommand;

//# sourceMappingURL=default_playlist.js.map
