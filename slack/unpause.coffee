SlackCommand = require '../slack_command.js'

class UnpauseCommand extends SlackCommand
  regex: /^(play|unpause)$/

  run: (cb) ->
    @api.songs.unpause()
    cb ":play: Unpaused"

module.exports = UnpauseCommand
