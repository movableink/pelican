module.exports = (io, songs) ->
  io.sockets.on 'connection', (socket) ->
    socket.on 'fetch', ->
      socket.emit 'reset', songs.toJSON()

    socket.on 'whatsPlaying?', ->
      if songs.length and not songs.paused then socket.emit 'songChange', songs.first().toJSON()
      else socket.emit 'songChange', false

    socket.on 'songNext', -> songs.next()

  songs.on 'add', (song) -> io.sockets.emit 'add', song

  songs.on 'remove', (song) -> io.sockets.emit 'remove', song

  songs.on 'change', (song) -> io.sockets.emit 'change', song

  songs.on 'next', (song) -> io.sockets.emit 'songChange', song

  songs.on 'pause', -> io.sockets.emit 'pause'

  songs.on 'unpause', -> io.sockets.emit 'unpause'
