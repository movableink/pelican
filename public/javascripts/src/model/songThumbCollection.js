define(['backbone', 'model/songThumb'], function(Backbone, SongThumb) {
  return Backbone.Collection.extend({
    model: SongThumb,
    url: '/api/songs',
    socket: null,
    initialize: function(attrs, options) {
      if (options.socket) {
        this.socket = options.socket;
        return this.initializeSocket();
      }
    },
    initializeSocket: function() {
      this.socket.on('add', (function(_this) {
        return function(model) {
          return _this.add(model);
        };
      })(this));
      this.socket.on('remove', (function(_this) {
        return function(model) {
          return _this.remove(model);
        };
      })(this));
      this.socket.on('reset', (function(_this) {
        return function(models) {
          return _this.reset(models);
        };
      })(this));
      return this.socket.on('change', (function(_this) {
        return function(model) {
          return _this.get(model.id).set(model);
        };
      })(this));
    },
    fetch: function() {
      if (!this.socket) {
        return Backbone.Collection.fetch.apply(this, arguments);
      }
      return this.socket.emit('fetch');
    }
  });
});

//# sourceMappingURL=songThumbCollection.js.map
