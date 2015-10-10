var QueueCommand, SlackCommand,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

SlackCommand = require('../slack_command.js');

QueueCommand = (function(superClass) {
  extend(QueueCommand, superClass);

  function QueueCommand() {
    return QueueCommand.__super__.constructor.apply(this, arguments);
  }

  QueueCommand.prototype.regex = /queue|playing/;

  QueueCommand.prototype.run = function(cb) {
    var playing, queue, response;
    queue = "";
    playing = "";
    if (this.api.songs.length > 0) {
      this.api.songs.forEach((function(_this) {
        return function(song, idx) {
          if (idx === 0) {
            return playing = "Currently Playing: " + (song.get('title')) + "\n";
          } else {
            return queue += idx + ". " + (song.get('title')) + "\n";
          }
        };
      })(this));
    } else {
      playing = "There is nothing playing.";
    }
    response = {
      title: playing,
      color: 'good',
      text: queue
    };
    return cb(response);
  };

  return QueueCommand;

})(SlackCommand);

module.exports = QueueCommand;

//# sourceMappingURL=queue.js.map
