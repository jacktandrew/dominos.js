jQuery ->
  class Domino extends Backbone.Model
    defaults:
      
  class DominoCollection extends Backbone.Collection
    model: Domino
    
  class CollectionView extends Backbone.View
    el: $ 'body'
    
    initialize: ->
      _.bindAll @
      
      @collection = new List
      @collection.bind 'add', @appendDomino
      
      @counter = 0
      @render()
      
    render: ->
      $(@el).append 
      $(@el).append 