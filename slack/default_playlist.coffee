SlackCommand = require '../slack_command.js'
DefaultList = require '../models/default_list.js'

class DefaultPlaylistCommand extends SlackCommand
  regex: /youtube\.com\/playlist\?list=([^&>]+)/

  run: (cb) ->
    match = @text.match @regex

    id = match[1]
    return unless id

    # if text ends with a number, start with that
    songIndex = @text.match(/\s(\d+)$/)?[1]
    songIndex = parseInt(songIndex) - 1 if songIndex

    list = new DefaultList
      listId: id
      songIndex: songIndex or 0

    list.fetch
      success: (model) =>
        cb "Pulling songs from \"#{model.get('title')}\" (#{model.get('songs').length} tracks) when nothing else is queued"

        DefaultList.current = model
        @api.songs.next() if @api.songs.length is 0

      error: (model) ->
        console.error model

module.exports = DefaultPlaylistCommand
