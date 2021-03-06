define(['backbone'], function(Backbone) {
  return Backbone.Model.extend({
    defaults: {
      song: false
    },
    socket: null,
    initialize: function(attrs, options) {
      if (options.socket) {
        this.socket = options.socket;
        return this.initializeSocket();
      }
    },
    initializeSocket: function() {
      this.socket.on('songChange', (function(_this) {
        return function(song) {
          return _this.set('song', song);
        };
      })(this));
      return this.socket.on('remove', (function(_this) {
        return function() {
          return _this.fetch();
        };
      })(this));
    },
    next: function() {
      if (document.location.hash !== '#secondary') {
        return this.socket.emit('songNext');
      }
    },
    fetch: function() {
      if (!this.socket) {
        return Backbone.Model.prototype.fetch.apply(this, arguments);
      }
      return this.socket.emit('whatsPlaying?');
    }
  });
});

//# sourceMappingURL=player.js.map
