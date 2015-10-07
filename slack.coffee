Slack = require 'slack-client'
api = require './routes/api'
io = require 'socket.io'

slackToken = process.env.SLACK_TOKEN
autoReconnect = true
autoMark = true

slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on 'open', ->
  console.log "Connected to #{slack.team.name} as #{slack.self.name}"

slack.on 'message', (message) ->
  if message.text?.match(/^\<https?:\/\/www.youtube.com/)
    url = message.text.slice(1, -1)

    api.songs.add { url: url }
    api.songs.fetch
      complete: (model, results, valid, invalid) ->
        r =
          ok: !!valid.length
          song: results[0]

        response = "Added track #{r.song.get('title')} (#{api.songs.length - 1} already in queue)"
        channel = slack.getChannelGroupOrDMByID(message.channel)
        channel.send response
  if message.text == "skip"
    api.songs.shift()

    response = "Skipping to the next track"
    channel = slack.getChannelGroupOrDMByID(message.channel)
    channel.send response

  if message.text?.match(/queue/)
    idx = 0
    response = "Queue:\n"
    api.songs.forEach (song) ->
      response += "#{idx}: #{song.get('title')}\n" unless idx == 0
      idx += 1
    channel = slack.getChannelGroupOrDMByID(message.channel)
    channel.send response

  if message.text?.match(/playing/)
    response = "Currently Playing: #{api.songs.at(0).get('title')}"
    channel = slack.getChannelGroupOrDMByID(message.channel)
    channel.send response

  if message.text == "pause"
    console.log slack.io
    console.log slack.io.sockets
    slack.io.sockets.emit 'pause'

  if message.text == "play"
    slack.io.sockets.emit 'unpause'

slack.on 'error', (err) ->
  console.error "Error", err

slack.setSocket = (io) ->
  @io = io

slack.login()

module.exports = slack
