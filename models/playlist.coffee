Backbone = require 'backbone'
SongCollection = require './songCollection.js'
DefaultList = require './default_list.js'

Playlist = SongCollection.extend
  paused: false

  nowPlaying: ->
    return false if @paused
    if @length then @first() else false

  next: ->
    @remove @first()

    if DefaultList.current and not @first()
      return @add DefaultList.current.getSong()

    @trigger 'next', @nowPlaying()
    @

  pause: ->
    @paused = true
    @trigger 'pause'

  unpause: ->
    @paused = false
    @trigger 'unpause'

  reset: ->
    res = SongCollection::reset.call @
    @trigger 'next', @nowPlaying()
    res

  add: (models, options) ->
    oldLength = @length
    res = SongCollection::add.call @, models, options
    if oldLength == 0 and @length > 0 then @trigger 'next', @nowPlaying()
    res

module.exports = Playlist
