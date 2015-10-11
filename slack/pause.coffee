SlackCommand = require '../slack_command.js'

class PauseCommand extends SlackCommand
  regex: /^pause|stop$/

  run: (cb) ->
    @api.songs.pause()
    cb ":pause: Paused"

module.exports = PauseCommand
