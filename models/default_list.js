var Backbone, DefaultList, Song, _, request;

Backbone = require('backbone');

request = require('request');

_ = require('underscore');

Song = require('./song.js');

DefaultList = Backbone.Model.extend({
  defaults: {
    url: '',
    listId: '',
    title: '',
    songIndex: 0
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
        if (!this.get('listId')) {
          return this.set('listId', List.listIdFromUrl(this.get('url')));
        }
      };
    };
  })(this)(),
  url: function() {
    return 'https://www.youtube.com/list_ajax?style=json&action_get_list=1&list=' + this.get('listId');
  },
  parse: function(res) {
    return {
      url: 'https://www.youtube.com/playlist?list=' + this.get('listId'),
      title: res.title,
      songs: res.video.map(function(songAttrs) {
        return new Song({
          url: "https://www.youtube.com/watch?v=" + songAttrs.encrypted_id,
          title: songAttrs.title,
          thumbnail: songAttrs.thumbnail
        });
      })
    };
  },
  getSong: function() {
    var idx, song;
    idx = this.get('songIndex');
    song = this.get('songs')[idx];
    idx += 1;
    if (idx >= this.get('songs').length) {
      this.set('songIndex', 0);
    } else {
      this.set('songIndex', idx);
    }
    return song;
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
  },
  listIdFromUrl: function(url) {
    return url.match(/[\&\?]list=([0-9A-Za-z]+)/)[1];
  }
});

DefaultList.current = null;

module.exports = DefaultList;

//# sourceMappingURL=default_list.js.map
