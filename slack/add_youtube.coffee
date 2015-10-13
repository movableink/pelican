SlackCommand = require '../slack_command.js'

class AddYoutubeCommand extends SlackCommand
  regex: /www\.youtube\.com\/watch\?v=([^&>\s]+)|m.youtube.com\/watch\?v=([^&>\s]+)|youtu.be\/([^&>\s]+)/

  run: (cb) ->
    match = @text.match @regex

    id = match[1] or match[2] or match[3]
    return unless id

    @api.songs.add { url: "http://www.youtube.com/watch?v=#{id}" }
    @api.songs.fetch
      complete: (model, results, valid, invalid) =>
        song = results[0]

        if song
          if @api.songs.length is 0
            t = "sometime"
          else if @api.songs.length is 1
            t = "now"
          else if @api.songs.length is 2
            t = "next"
          else
            t = "after #{@api.songs.length - 1} other songs"

          response = "Added track #{@song.get('title')}, queued to play #{t}"

          cb response

module.exports = AddYoutubeCommand
