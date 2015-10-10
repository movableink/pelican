var Backbone, Song, sandbox;

sandbox = require('sandboxed-module');

Song = require('./song.js');

Backbone = require('backbone');

module.exports = sandbox.require('../../models/songCollection.js', {
  requires: {
    backbone: Backbone,
    './song.js': sandbox.require('./song.js', {
      requires: {
        backbone: Backbone
      }
    })
  }
});

//# sourceMappingURL=songCollection.js.map
