Backbone = require 'backbone'

Channel = Backbone.Model.extend
  defaults:
    url: ''
    username: ''
    title: ''

  initialize: do =>
    id = 0
    ->
      @set 'id', id, { silent: true }
      id += 1
      unless @get('username') then @set 'username', Channel.usernameFromUrl(@get('url'))

  url: ->
    'https://www.youtube.com/list_ajax?style=json&action_get_user_uploads_by_user=1&username=' + @get('username')

  parse: (res) ->
    url: 'https://www.youtube.com/embed?listType=user_uploads&list=' + @get('username') + '&format=json'
    title: res.title

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

  usernameFromUrl: (url) ->
    url.match(/user\/([^\/]+)/)[1]

module.exports = Channel
