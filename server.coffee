http = require 'http'
app = require './app.js'
socket = require './socket.js'
slack = require './slack.js'

# Run HTTP server
server = http.createServer(app).listen app.get('port'), ->
	console.log "Express server listening on port " + app.get('port')

# Run WS server
io = require('socket.io').listen(server)
socket io, app.get('songs')
slack.setSocket io
