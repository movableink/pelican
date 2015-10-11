var Backbone, DefaultList, Playlist, SongCollection;

Backbone = require('backbone');

SongCollection = require('./songCollection.js');

DefaultList = require('./default_list.js');

Playlist = SongCollection.extend({
  paused: false,
  nowPlaying: function() {
    if (this.paused) {
      return false;
    }
    if (this.length) {
      return this.first();
    } else {
      return false;
    }
  },
  next: function() {
    this.remove(this.first());
    if (DefaultList.current && !this.first()) {
      return this.add(DefaultList.current.getSong());
    }
    this.trigger('next', this.nowPlaying());
    return this;
  },
  pause: function() {
    this.paused = true;
    return this.trigger('pause');
  },
  unpause: function() {
    this.paused = false;
    return this.trigger('unpause');
  },
  reset: function() {
    var res;
    res = SongCollection.prototype.reset.call(this);
    this.trigger('next', this.nowPlaying());
    return res;
  },
  add: function(models, options) {
    var oldLength, res;
    oldLength = this.length;
    res = SongCollection.prototype.add.call(this, models, options);
    if (oldLength === 0 && this.length > 0) {
      this.trigger('next', this.nowPlaying());
    }
    return res;
  }
});

module.exports = Playlist;

//# sourceMappingURL=playlist.js.map
