Backbone = require 'backbone'
request = require 'request'
_ = require 'underscore'

Song = Backbone.Model.extend
  defaults:
    url: ''
    ytId: ''
    title: ''
    thumbnail: ''

  initialize: do =>
    id = 0
    ->
      @set 'id', id, { silent: true }
      id += 1
      unless @get('ytId') then @set 'ytId', Song.ytId(@get('url'))

  url: ->
    'http://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=' + @get('ytId') + '&format=json'

  parse: (res) ->
    url: "http://www.youtube.com/watch?v=#{@get('ytId')}"
    title: res.title
    thumbnail: res.thumbnail_url

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
,
  ytId: (url) ->
    url.match(/v=([^&]*)/)[1]

module.exports = Song
