var Backbone, Song, _, request;

Backbone = require('backbone');

request = require('request');

_ = require('underscore');

Song = Backbone.Model.extend({
  defaults: {
    url: '',
    ytId: '',
    title: '',
    thumbnail: ''
  },
  initialize: (function(_this) {
    return function() {
      var id;
      id = 0;
      return function() {
        this.set('id', id, {
          silent: true
        });
        id += 1;
        if (!this.get('ytId')) {
          return this.set('ytId', Song.ytId(this.get('url')));
        }
      };
    };
  })(this)(),
  url: function() {
    return 'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + this.get('ytId') + '&format=json';
  },
  parse: function(res) {
    return {
      url: "http://www.youtube.com/watch?v=" + (this.get('ytId')),
      title: res.title,
      thumbnail: res.thumbnail_url
    };
  },
  fetch: function(options) {
    options = options ? _.clone(options) : {};
    options.success = options.success || function() {};
    options.error = options.error || function() {};
    return request({
      uri: this.url()
    }, (function(_this) {
      return function(err, res, body) {
        if (res.statusCode !== 200) {
          options.error(_this);
          return;
        }
        _this.set(_this.parse(JSON.parse(body)));
        return options.success(_this);
      };
    })(this));
  },
  isFetched: function() {
    return this.get('title') !== '';
  }
}, {
  ytId: function(url) {
    var ref, ref1;
    return ((ref = url.match(/[\&\?]v=([^&]*)/)) != null ? ref[1] : void 0) || ((ref1 = url.match(/tu\.be\/([^&]*)/)) != null ? ref1[1] : void 0);
  }
});

module.exports = Song;

//# sourceMappingURL=song.js.map
