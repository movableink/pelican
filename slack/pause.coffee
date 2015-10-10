SlackCommand = require '../slack_command.js'

class PauseCommand extends SlackCommand
  regex: /^pause|stop$/

  run: (cb) ->
    @io.sockets.emit 'pause'
    cb ":pause: Paused"

module.exports = PauseCommand
