var BOT_NAME, MUSIC_CHANNEL_NAME, Slack, api, autoMark, autoReconnect, commands, files, fs, slack, slackToken;

Slack = require('slack-client');

api = require('./routes/api');

fs = require('fs');

MUSIC_CHANNEL_NAME = process.env.MUSIC_CHANNEL_NAME || "music";

BOT_NAME = process.env.BOT_NAME || "jukebox";

commands = [];

files = fs.readdirSync('./slack/');

files.forEach(function(file) {
  if (file.match(/\.js$/)) {
    return commands.push(require("./slack/" + file));
  }
});

console.log("Loaded commands: " + (commands.map(function(command) {
  return command.name;
}).join(', ')));

slackToken = process.env.SLACK_TOKEN;

autoReconnect = true;

autoMark = true;

slack = new Slack(slackToken, autoReconnect, autoMark);

slack.on('open', function() {
  console.log("Connected to " + slack.team.name + " as " + slack.self.name);
  return console.log("  with bot name " + BOT_NAME + " listening in channel " + MUSIC_CHANNEL_NAME);
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
  return commands.forEach(function(command) {
    var p;
    p = new command(api, message);
    if (p.matches()) {
      console.log("Matched command " + p.constructor.name);
      return p.run(function(response) {
        if (typeof response === "string") {
          channel.send(response);
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

api.songs.on('next', function(song) {
  var channel, response;
  if (!song) {
    return;
  }
  response = {
    fallback: "Playing track",
    title: song.get('title'),
    title_link: song.get('url'),
    thumb_url: song.get('thumbnail'),
    text: ":play: Now playing"
  };
  channel = slack.getChannelByName(MUSIC_CHANNEL_NAME);
  return channel.postMessage({
    as_user: true,
    attachments: [response]
  });
});

slack.on('error', function(err) {
  return console.error("Error", err);
});

slack.login();

module.exports = slack;

//# sourceMappingURL=slack.js.map
