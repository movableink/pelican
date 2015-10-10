SlackCommand = require '../slack_command.js'

class QueueCommand extends SlackCommand
  regex: /queue|playing/

  run: (cb) ->
    queue = ""
    playing = ""
    if @api.songs.length > 0
      @api.songs.forEach (song, idx) =>
        if idx is 0
          playing = "Currently Playing: #{song.get('title')}\n"
        else
          queue += "#{idx}. #{song.get('title')}\n"
    else
      playing = "There is nothing playing."

    response =
      title: playing
      color: 'good'
      text: queue

    cb response

module.exports = QueueCommand
