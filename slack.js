var BOT_NAME, MUSIC_CHANNEL_NAME, Slack, api, autoMark, autoReconnect, files, fs, plugins, slack, slackToken;

Slack = require('slack-client');

api = require('./routes/api');

fs = require('fs');

MUSIC_CHANNEL_NAME = process.env.MUSIC_CHANNEL_NAME || "music";

BOT_NAME = process.env.BOT_NAME || "jukebox";

plugins = [];

files = fs.readdirSync('./slack/');

files.forEach(function(file) {
  if (file.match(/\.js$/)) {
    return plugins.push(require("./slack/" + file));
  }
});

plugins.forEach(function(plugin) {
  return console.log("Loaded command: " + plugin.name);
});

slackToken = process.env.SLACK_TOKEN;

autoReconnect = true;

autoMark = true;

slack = new Slack(slackToken, autoReconnect, autoMark);

slack.on('open', function() {
  return console.log("Connected to " + slack.team.name + " as " + slack.self.name);
});

slack.on('message', function(message) {
  var channel, user;
  channel = slack.getChannelGroupOrDMByID(message.channel);
  if (channel.name !== MUSIC_CHANNEL_NAME) {
    return;
  }
  user = slack.getUserByID(message.user);
  if ((user != null ? user.name : void 0) === BOT_NAME) {
    return;
  }
  console.log("Got message: " + message.text);
  return plugins.forEach(function(plugin) {
    var p;
    p = new plugin(api, message, slack.io);
    if (p.matches()) {
      console.log("Matched command " + p.constructor.name);
      return p.run(function(response) {
        if (typeof response === "string") {
          channel.send("DEV: " + response);
        }
        if (typeof response === "object") {
          return channel.postMessage({
            as_user: true,
            text: response.fallback,
            attachments: [response]
          });
        }
      });
    }
  });
});

slack.on('error', function(err) {
  return console.error("Error", err);
});

slack.setSocket = function(io) {
  return this.io = io;
};

slack.login();

module.exports = slack;

//# sourceMappingURL=slack.js.map
