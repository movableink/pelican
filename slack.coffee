SlackClient = require 'slack-client'
api = require './routes/api'
fs = require 'fs'

class Slack
  commands: []

  constructor: (@channelName) ->
    @loadCommands()

    slackToken = process.env.SLACK_TOKEN
    autoReconnect = true
    autoMark = true

    @client = new SlackClient(slackToken, autoReconnect, autoMark)
    @client.on 'open', @open
    @client.on 'message', @message
    @client.on 'error', @error
    api.songs.on 'next', @displaySong

  login: ->
    @client.login()

  channel: ->
    @_channel ?= @client.getChannelByName(@channelName)

  loadCommands: ->
    @commands = []
    files = fs.readdirSync './slack/'
    files.forEach (file) =>
      @commands.push require("./slack/#{file}") if file.match(/\.js$/)

    console.log "Loaded commands: #{@commands.map((c) -> c.name).join(', ')}"

  open: =>
    console.log ["Connected to #{@client.team.name}",
                 "as #{@client.self.name}",
                 "listening in channel #{@channelName}"].join(' ')

  message: (message) =>
    return unless message.channel is @channel().id

    user = @client.getUserByID(message.user)
    return if user?.name is @client.self.name or not user?.name

    @commands.forEach (command) =>
      p = new command(api, message)
      if p.matches()
        console.log "Matched command #{p.constructor.name}"
        p.run (response) =>
          if typeof(response) is "string"
            @channel().send response
          if typeof(response) is "object"
            @channel().postMessage
              as_user: true
              text: response.fallback
              attachments: [response]

  displaySong: (song) =>
    return unless song

    response =
      fallback: "Playing track"
      title: song.get('title')
      title_link: song.get('url')
      thumb_url: song.get('thumbnail')
      text: ":play: Now playing"

    @channel().postMessage
      as_user: true
      attachments: [response]

  error: (err) =>
    console.error "Error", err

module.exports = Slack
