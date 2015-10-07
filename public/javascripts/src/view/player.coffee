define [
	'backbone',
	'mustache',
	'text!/templates/player.tmpl',
	'plugin/jquery.tubeplayer'
], (Backbone, Mustache, tmpl) ->
	Backbone.View.extend
		initialize: (options) ->
      @ready = false

      $.tubeplayer.defaults.afterReady = =>
        # @$yt.hide()
        @ready = true
        @trigger('ready')

      @model.socket.on 'pause', (->
        @trigger 'pause'
      ).bind(@model)

      @model.socket.on 'unpause', (->
        @trigger 'unpause'
      ).bind(@model)

      @model.on 'change:song', (song) =>
        @render()

      @model.on 'pause', =>
        console.log "pause"
        @pause()

      @model.on 'unpause', =>
        console.log "pause"
        @unpause()

    pause: ->
      @$yt.tubeplayer 'pause'

    unpause: ->
      @$yt.tubeplayer 'play'

		end: ->
			@model.next()

		error: ->
			@model.next()

		update: ->
			song = @model.get 'song'
			title = @$el.find '.title'

			if song
				@$yt.show()
				@$yt.tubeplayer 'play', song.ytId
				title.html song.title
			else
				@$yt.tubeplayer 'stop'
				# @$yt.hide()
				title.html ''

		$yt: null

		render: ->
			if @ready
				@update();
				return
			@ready = true

			@$el.html Mustache.render(tmpl, {})
			@$yt = @$el.find '.yt'
			@$yt.tubeplayer
				allowFullscreen: true
				iframed: true
				width: 860
				height: 500
				showControls: true
				modestbranding: false
				onPlayerEnded: @end.bind(@)
				onErrorNotEmbeddable: @error.bind(@)
