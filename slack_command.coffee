class SlackCommand
  constructor: (api, message) ->
    @api = api
    @message = message
    @text = message.text or ""

  matches: ->
    @text.toLowerCase().match(@regex)

module.exports = SlackCommand
