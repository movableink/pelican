Slack = require 'slack-client'
api = require './routes/api'
fs = require 'fs'

MUSIC_CHANNEL_NAME = process.env.MUSIC_CHANNEL_NAME or "music"
BOT_NAME = process.env.BOT_NAME or "jukebox"

commands = []

files = fs.readdirSync './slack/'
files.forEach (file) ->
  commands.push require("./slack/#{file}") if file.match(/\.js$/)

console.log "Loaded commands: #{commands.map((command) -> command.name).join(', ')}"

slackToken = process.env.SLACK_TOKEN
autoReconnect = true
autoMark = true

slack = new Slack(slackToken, autoReconnect, autoMark)

slack.on 'open', ->
  console.log "Connected to #{slack.team.name} as #{slack.self.name}"
  console.log "  with bot name #{BOT_NAME} listening in channel #{MUSIC_CHANNEL_NAME}"

slack.on 'message', (message) ->
  channel = slack.getChannelGroupOrDMByID(message.channel)
  return unless channel.name is MUSIC_CHANNEL_NAME

  user = slack.getUserByID(message.user)
  return if user?.name is BOT_NAME or not user?.name

  commands.forEach (command) ->
    p = new command(api, message)
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

api.songs.on 'next', (song) ->
  return unless song

  response =
    fallback: "Playing track"
    title: song.get('title')
    title_link: song.get('url')
    thumb_url: song.get('thumbnail')
    text: ":play: Now playing"

  channel = slack.getChannelByName(MUSIC_CHANNEL_NAME)
  channel.postMessage
    as_user: true
    attachments: [response]

slack.on 'error', (err) ->
  console.error "Error", err

slack.login()

module.exports = slack
