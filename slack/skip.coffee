SlackCommand = require '../slack_command.js'

class SkipCommand extends SlackCommand
  regex: /^skip/

  run: (cb) ->
    @api.songs.shift()

    cb ":next-track: Skipping track"

module.exports = SkipCommand
