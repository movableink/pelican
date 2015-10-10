define(['backbone', 'mustache', 'text!/templates/songThumb.tmpl'], function(Backbone, Mustache, template) {
  return Backbone.View.extend({
    initialize: function() {
      return this.model.on('change', (function(_this) {
        return function() {
          return _this.render();
        };
      })(this));
    },
    render: function() {
      this.$el.html(Mustache.render(template, this.model.toJSON()));
      return this;
    }
  });
});

//# sourceMappingURL=songThumb.js.map
