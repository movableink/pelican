var Backbone, Channel;

Backbone = require('backbone');

Channel = Backbone.Model.extend({
  defaults: {
    url: '',
    username: '',
    title: ''
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
        if (!this.get('username')) {
          return this.set('username', Channel.usernameFromUrl(this.get('url')));
        }
      };
    };
  })(this)(),
  url: function() {
    return 'https://www.youtube.com/list_ajax?style=json&action_get_user_uploads_by_user=1&username=' + this.get('username');
  },
  parse: function(res) {
    return {
      url: 'https://www.youtube.com/embed?listType=user_uploads&list=' + this.get('username') + '&format=json',
      title: res.title
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
  },
  usernameFromUrl: function(url) {
    return url.match(/user\/([^\/]+)/)[1];
  }
});

module.exports = Channel;

//# sourceMappingURL=channel.js.map
