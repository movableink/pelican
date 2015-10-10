class SlackCommand
  constructor: (api, message, io) ->
    @api = api
    @io = io
    @message = message
    @text = message.text or ""

  matches: ->
    @text.toLowerCase().match(@regex)

module.exports = SlackCommand
