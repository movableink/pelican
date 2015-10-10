var SlackCommand;

SlackCommand = (function() {
  function SlackCommand(api, message, io) {
    this.api = api;
    this.io = io;
    this.message = message;
    this.text = message.text || "";
  }

  SlackCommand.prototype.matches = function() {
    return this.text.toLowerCase().match(this.regex);
  };

  return SlackCommand;

})();

module.exports = SlackCommand;

//# sourceMappingURL=slack_command.js.map
