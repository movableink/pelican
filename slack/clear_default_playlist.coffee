SlackCommand = require '../slack_command.js'
DefaultList = require '../models/default_list.js'

class ClearDefaultPlaylistCommand extends SlackCommand
  regex: /(no|clear) default playlist/

  run: (cb) ->
    DefaultList.current = null
    cb "Cleared default playlist."

module.exports = ClearDefaultPlaylistCommand
