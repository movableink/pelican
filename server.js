var Slack, app, http, io, server, slack, socket;

http = require('http');

app = require('./app.js');

socket = require('./socket.js');

Slack = require('./slack.js');

slack = new Slack(process.env.MUSIC_CHANNEL_NAME || "music");

slack.login();

server = http.createServer(app).listen(app.get('port'), function() {
  return console.log("Express server listening on port " + app.get('port'));
});

io = require('socket.io').listen(server);

socket(io, app.get('songs'));

//# sourceMappingURL=server.js.map
