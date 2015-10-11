var Slack, SlackClient, api, fs,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

SlackClient = require('slack-client');

api = require('./routes/api');

fs = require('fs');

Slack = (function() {
  Slack.prototype.commands = [];

  function Slack(channelName) {
    var autoMark, autoReconnect, slackToken;
    this.channelName = channelName;
    this.error = bind(this.error, this);
    this.displaySong = bind(this.displaySong, this);
    this.message = bind(this.message, this);
    this.open = bind(this.open, this);
    this.loadCommands();
    slackToken = process.env.SLACK_TOKEN;
    autoReconnect = true;
    autoMark = true;
    this.client = new SlackClient(slackToken, autoReconnect, autoMark);
    this.client.on('open', this.open);
    this.client.on('message', this.message);
    this.client.on('error', this.error);
    api.songs.on('next', this.displaySong);
  }

  Slack.prototype.login = function() {
    return this.client.login();
  };

  Slack.prototype.channel = function() {
    return this._channel != null ? this._channel : this._channel = this.client.getChannelByName(this.channelName);
  };

  Slack.prototype.loadCommands = function() {
    var files;
    this.commands = [];
    files = fs.readdirSync('./slack/');
    files.forEach((function(_this) {
      return function(file) {
        if (file.match(/\.js$/)) {
          return _this.commands.push(require("./slack/" + file));
        }
      };
    })(this));
    return console.log("Loaded commands: " + (this.commands.map(function(c) {
      return c.name;
    }).join(', ')));
  };

  Slack.prototype.open = function() {
    return console.log(["Connected to " + this.client.team.name, "as " + this.client.self.name, "listening in channel " + this.channelName].join(' '));
  };

  Slack.prototype.message = function(message) {
    var user;
    if (message.channel !== this.channel().id) {
      return;
    }
    user = this.client.getUserByID(message.user);
    if ((user != null ? user.name : void 0) === this.client.self.name || !(user != null ? user.name : void 0)) {
      return;
    }
    return this.commands.forEach((function(_this) {
      return function(command) {
        var p;
        p = new command(api, message);
        if (p.matches()) {
          console.log("Matched command " + p.constructor.name);
          return p.run(function(response) {
            if (typeof response === "string") {
              _this.channel().send(response);
            }
            if (typeof response === "object") {
              return _this.channel().postMessage({
                as_user: true,
                text: response.fallback,
                attachments: [response]
              });
            }
          });
        }
      };
    })(this));
  };

  Slack.prototype.displaySong = function(song) {
    var response;
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
    return this.channel().postMessage({
      as_user: true,
      attachments: [response]
    });
  };

  Slack.prototype.error = function(err) {
    return console.error("Error", err);
  };

  return Slack;

})();

module.exports = Slack;

//# sourceMappingURL=slack.js.map
