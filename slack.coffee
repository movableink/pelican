Slack = require 'slack-client'
api = require './routes/api'
fs = require 'fs'

MUSIC_CHANNEL_NAME = process.env.MUSIC_CHANNEL_NAME or "music"
BOT_NAME = process.env.BOT_NAME or "jukebox"

plugins = []

files = fs.readdirSync './slack/'
files.forEach (file) ->
  plugins.push require("./slack/#{file}") if file.match(/\.js$/)

plugins.forEach (plugin) ->
  console.log "Loaded command: #{plugin.name}"

slackToken = process.env.SLACK_TOKEN
autoReconnect = true
autoMark = true

slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on 'open', ->
  console.log "Connected to #{slack.team.name} as #{slack.self.name}"

slack.on 'message', (message) ->
  channel = slack.getChannelGroupOrDMByID(message.channel)
  return unless channel.name is MUSIC_CHANNEL_NAME

  user = slack.getUserByID(message.user)
  return if user?.name is BOT_NAME

  console.log "Got message: #{message.text}"

  plugins.forEach (plugin) ->
    p = new plugin(api, message, slack.io)
    if p.matches()
      console.log "Matched command #{p.constructor.name}"
      p.run (response) ->
        if typeof(response) is "string"
          channel.send response
        if typeof(response) is "object"
          channel.postMessage
            as_user: true
            text: response.fallback
            attachments: [response]

slack.on 'error', (err) ->
  console.error "Error", err

slack.setSocket = (io) ->
  @io = io

slack.login()

module.exports = slack
