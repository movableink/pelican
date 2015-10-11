Backbone = require 'backbone'
request = require 'request'
_ = require 'underscore'
Song = require './song.js'

DefaultList = Backbone.Model.extend
  defaults:
    url: ''
    listId: ''
    title: ''
    songIndex: 0

  initialize: do =>
    id = 0
    ->
      @set 'id', id, { silent: true }
      id += 1
      unless @get('listId') then @set 'listId', List.listIdFromUrl(@get('url'))

  url: ->
    'https://www.youtube.com/list_ajax?style=json&action_get_list=1&list=' + @get('listId')

  parse: (res) ->
    url: 'https://www.youtube.com/playlist?list=' + @get('listId')
    title: res.title
    songs: res.video.map (songAttrs) ->
      new Song
        url: "https://www.youtube.com/watch?v=" + songAttrs.encrypted_id
        title: songAttrs.title
        thumbnail: songAttrs.thumbnail

  getSong: ->
    idx = @get('songIndex')
    song = @get('songs')[idx]

    idx += 1
    if idx >= @get('songs').length
      @set 'songIndex', 0
    else
      @set 'songIndex', idx

    song

  fetch: (options) ->
    options = if options then _.clone(options) else {}
    options.success = options.success or ->
    options.error = options.error or ->

    request
      uri: @url()
    , (err, res, body) =>
      if res.statusCode isnt 200
        options.error @
        return

      @set @parse(JSON.parse(body))
      options.success @

  isFetched: ->
    @get('title') isnt ''

  listIdFromUrl: (url) ->
    url.match(/[\&\?]list=([0-9A-Za-z]+)/)[1]

# No list by default
DefaultList.current = null

module.exports = DefaultList
