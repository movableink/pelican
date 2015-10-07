// Generated by CoffeeScript 1.9.3
(function() {
  var app, http, io, server, slack, socket;

  http = require('http');

  app = require('./app.js');

  socket = require('./socket.js');

  slack = require('./slack.js');

  server = http.createServer(app).listen(app.get('port'), function() {
    return console.log("Express server listening on port " + app.get('port'));
  });

  io = require('socket.io').listen(server);

  socket(io, app.get('songs'));

  slack.setSocket(io);

}).call(this);
