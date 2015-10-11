module.exports = function(io, songs) {
  io.sockets.on('connection', function(socket) {
    socket.on('fetch', function() {
      return socket.emit('reset', songs.toJSON());
    });
    socket.on('whatsPlaying?', function() {
      if (songs.length && !songs.paused) {
        return socket.emit('songChange', songs.first().toJSON());
      } else {
        return socket.emit('songChange', false);
      }
    });
    return socket.on('songNext', function() {
      return songs.next();
    });
  });
  songs.on('add', function(song) {
    return io.sockets.emit('add', song);
  });
  songs.on('remove', function(song) {
    return io.sockets.emit('remove', song);
  });
  songs.on('change', function(song) {
    return io.sockets.emit('change', song);
  });
  songs.on('next', function(song) {
    return io.sockets.emit('songChange', song);
  });
  songs.on('pause', function() {
    return io.sockets.emit('pause');
  });
  return songs.on('unpause', function() {
    return io.sockets.emit('unpause');
  });
};

//# sourceMappingURL=socket.js.map
