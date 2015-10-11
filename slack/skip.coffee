SlackCommand = require '../slack_command.js'

class SkipCommand extends SlackCommand
  regex: /^skip|^next/

  run: (cb) ->
    @api.songs.paused = false
    @api.songs.next()

    cb ":next-track: Skipping track"

module.exports = SkipCommand
