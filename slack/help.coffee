SlackCommand = require '../slack_command.js'
DefaultList = require '../models/default_list.js'

class HelpCommand extends SlackCommand
  regex: /^help/

  run: (cb) ->
    msg = """*Jukebox Help:*
`https://www.youtube.com/watch?v=XXXXXX` : add a song to the queue to be played
`queue` : show the current queue
`pause` / `unpause` : pause and unpause the currently playing track
`skip` : skip to the next track
`default https://www.youtube.com/playlist?list=XXXXXXXX 5` : when there are no songs queued by users, start pulling songs from the specified playlist URL, starting with the 5th song
`clear default playlist` : no default playlist, when queue end is reached songs will stop
"""
    cb msg

module.exports = HelpCommand
