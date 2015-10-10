define(['underscore', 'backbone', 'view/songThumb'], function(_, Backbone, SongThumb) {
  return Backbone.View.extend({
    tagName: 'ul',
    attributes: {
      className: 'songThumbCollection'
    },
    initialize: function() {
      this.collection.on('reset', this.reset.bind(this));
      this.collection.on('add', (function(_this) {
        return function(model) {
          return _this.add(model);
        };
      })(this));
      return this.collection.on('remove', (function(_this) {
        return function(model) {
          return _this.remove(model);
        };
      })(this));
    },
    empty: function() {
      return '<li class="empty">No songs in queue</li>';
    },
    reset: function() {
      this.$el.html(this.empty());
      return this.collection.each(this.add.bind(this));
    },
    add: function(model) {
      var view;
      this.$el.find('.empty').remove();
      view = new SongThumb({
        model: model,
        tagName: 'li'
      });
      this.views.push(view);
      this.$el.append(view.el);
      view.render();
      view.$el.hide();
      return view.$el.fadeIn();
    },
    remove: function(model) {
      return this.views = _(this.views).reject((function(_this) {
        return function(view) {
          var reject;
          reject = view.model === model;
          if (reject) {
            view.$el.fadeOut(function() {
              view.remove();
              if (!_this.views.length) {
                return _this.$el.html(_this.empty());
              }
            });
          }
          return reject;
        };
      })(this));
    },
    views: []
  });
});

//# sourceMappingURL=songThumbCollection.js.map
