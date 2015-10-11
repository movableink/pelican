define(['backbone', 'mustache', 'text!/templates/player.tmpl', 'plugin/jquery.tubeplayer'], function(Backbone, Mustache, tmpl) {
  return Backbone.View.extend({
    initialize: function(options) {
      this.ready = false;
      $.tubeplayer.defaults.afterReady = (function(_this) {
        return function() {
          _this.ready = true;
          return _this.trigger('ready');
        };
      })(this);
      this.model.socket.on('pause', (function() {
        return this.trigger('pause');
      }).bind(this.model));
      this.model.socket.on('unpause', (function() {
        return this.trigger('unpause');
      }).bind(this.model));
      this.model.on('change:song', (function(_this) {
        return function(song) {
          return _this.render();
        };
      })(this));
      this.model.on('pause', (function(_this) {
        return function() {
          console.log("pause");
          return _this.pause();
        };
      })(this));
      return this.model.on('unpause', (function(_this) {
        return function() {
          console.log("pause");
          return _this.unpause();
        };
      })(this));
    },
    pause: function() {
      console.log('pausing');
      return this.$yt.tubeplayer('pause');
    },
    unpause: function() {
      if (this.$yt.tubeplayer('player').getPlayerState() < 3) {
        console.log('unpausing');
        return this.$yt.tubeplayer('play');
      } else {
        console.log('starting playing');
        return this.update();
      }
    },
    end: function() {
      return this.model.next();
    },
    error: function() {
      return this.model.next();
    },
    update: function() {
      var song, title;
      song = this.model.get('song');
      title = this.$el.find('.title');
      if (song) {
        this.$yt.show();
        this.$yt.tubeplayer('play', song.ytId);
        return title.html(song.title);
      } else {
        this.$yt.tubeplayer('stop');
        return title.html('');
      }
    },
    $yt: null,
    render: function() {
      if (this.ready) {
        this.update();
        return;
      }
      this.ready = true;
      this.$el.html(Mustache.render(tmpl, {}));
      this.$yt = this.$el.find('.yt');
      return this.$yt.tubeplayer({
        allowFullscreen: true,
        iframed: true,
        width: 860,
        height: 500,
        showControls: true,
        modestbranding: false,
        onPlayerEnded: this.end.bind(this),
        onErrorNotEmbeddable: this.error.bind(this)
      });
    }
  });
});

//# sourceMappingURL=player.js.map
