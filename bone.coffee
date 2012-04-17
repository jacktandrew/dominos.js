boneyard = []

boneBuilder = (a, b) ->
  boneyard.push('_' + a + '_' + b)
  return boneyard if b is 0
  (a = b; b--) if a is 0
  boneBuilder(a-1, b)

draw = (n) ->
  randomDraw = _.shuffle(boneyard).splice(0, n)
  fabricate value for value in randomDraw

makePips = (x) ->
  starter = "<div></div>"
  if x < 1 then return '' else starter.concat(makePips(x - 1))
  
fabricate = (string) ->
  top = makePips( +string.charAt(1) )
  bottom = makePips( +string.charAt(3) )
  template = _.template("
    <div class='tile <%= pair %>'>
      <div class='pips <%= pair.slice(0,2) %>'>
        <%= topPips %>
      </div>
      <div class='bar'></div>
      <div class='pips <%= pair.slice(2,4) %>'>
        <%= bottomPips %>
      </div>
    </div>")
  domino = template({pair: string, topPips: top, bottomPips: bottom})
  $('body').append(domino)

$ ->
  boneBuilder(6,6)
  draw(3)