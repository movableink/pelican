var AddYoutubeCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

AddYoutubeCommand = (function(superClass) {
  extend(AddYoutubeCommand, superClass);

  function AddYoutubeCommand() {
    return AddYoutubeCommand.__super__.constructor.apply(this, arguments);
  }

  AddYoutubeCommand.prototype.regex = /www\.youtube\.com\/watch\?v=([^&>\s]+)|m.youtube.com\/watch\?v=([^&>\s]+)|youtu.be\/([^&>\s]+)/;

  AddYoutubeCommand.prototype.run = function(cb) {
    var id, match;
    match = this.text.match(this.regex);
    id = match[1] || match[2] || match[3];
    if (!id) {
      return;
    }
    this.api.songs.add({
      url: "http://www.youtube.com/watch?v=" + id
    });
    return this.api.songs.fetch({
      complete: (function(_this) {
        return function(model, results, valid, invalid) {
          var response, song;
          song = results[0];
          if (song) {
            response = {
              fallback: "Added track",
              title: song.get('title'),
              title_link: song.get('url'),
              fields: [
                {
                  title: 'Songs in queue before this one',
                  value: _this.api.songs.length - 1
                }
              ],
              thumb_url: song.get('thumbnail')
            };
            return cb(response);
          }
        };
      })(this)
    });
  };

  return AddYoutubeCommand;

})(SlackCommand);

module.exports = AddYoutubeCommand;

//# sourceMappingURL=add_youtube.js.map
