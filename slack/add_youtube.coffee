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
          response =
            fallback: "Added track"
            title: song.get('title')
            title_link: song.get('url')
            fields: [ { title: 'Songs in queue before this one', value: @api.songs.length - 1 } ]
            thumb_url: song.get('thumbnail')

          cb response

module.exports = AddYoutubeCommand
