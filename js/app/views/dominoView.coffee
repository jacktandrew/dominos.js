jQuery ->
  class DominoView extends Backbone.View
    el: $ 'body'
  
    initialize: ->
      _.bindAll @
      @render()

    render: ->
      $(@el).append '<h1>Hello, Backbone!</h1>'

    events: ->
      
  domino_view = new DominoView
    

