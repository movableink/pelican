http = require 'http'
app = require './app.js'
socket = require './socket.js'
Slack = require './slack.js'

# Respond to slack messages
slack = new Slack(process.env.MUSIC_CHANNEL_NAME or "music")
slack.login()

# Run HTTP server
server = http.createServer(app).listen app.get('port'), ->
	console.log "Express server listening on port " + app.get('port')

# Run WS server
io = require('socket.io').listen(server)
socket io, app.get('songs')
