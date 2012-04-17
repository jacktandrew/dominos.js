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
    <div class='tile draggable'>
      <div class='pips <%= pair.slice(0,2) %>'>
        <%= topPips %>
      </div>
      <div class='bar'></div>
      <div class='pips <%= pair.slice(2,4) %>'>
        <%= bottomPips %>
      </div>
    </div>")
  domino = template({pair: string, topPips: top, bottomPips: bottom})
  $('#boneyard').append(domino)

$ ->
  boneBuilder(6,6)
  draw(28)
  
  $( ".tile" ).dblclick ->
    $(this).animate({rotate: '+=90deg'}, 500, ->
      if 'rotate(0deg)' == $(this).css('transform') or 'rotate(180deg)' == $(this).css('transform')
        top = $(this).children()[0]; bottom = $(this).children()[2]
        $(this).css({transform: 'rotate(0deg)'}).prepend(bottom).append(top)
    )
            
  $( ".draggable" ).draggable({ 
    revert: "invalid",
    zIndex: 10,
    snap: ".drop_zone", 
    snapMode: "inner"
  })

  dropAsign = (num, pos) ->
    ident = 'upper' if pos is 'last'
    ident = 'lower' if pos is 'first'
    $(".drop_zone#" + ident).attr('rel', num).droppable({
      accept: ".tile:has(.pips:" + pos + "-child._" + num + ")",
      tolerance: 'fit',
      activeClass: "ui-state-hover",
      drop: (event, ui) ->
        el = this
        angle = $(el).css('transform')
        moveDZ(el, angle)
        rotateDZ(el, angle)
        $(ui.draggable[0]).draggable( "option", "disabled", true ).removeClass('ui-draggable draggable')
        if ui.draggable[0].children[0].childElementCount == ui.draggable[0].children[2].childElementCount
          rotateDouble(ui, el, angle)
        if pos is 'last'
          console.log('pos is last')
          dropAsign(ui.draggable[0].firstElementChild.childElementCount, pos)
        if pos is 'first'
          console.log('pos is first')
          dropAsign(ui.draggable[0].lastElementChild.childElementCount, pos)
    })

  $('.drop_zone#starter').droppable({
    accept: ".tile:has(._6 ~ ._6)",
    tolerance: 'fit',
    activeClass: "ui-state-hover",
    drop: (event, ui) ->
      el = this
      $(ui.draggable[0]).draggable( "option", "disabled", true ).removeClass('ui-draggable draggable')
      $(this).hide()
      dropAsign(6, 'first')
      dropAsign(6, 'last')
      $('.drop_zone#upper').show().animate({top: '-=56'}, 500).css({transform: 'rotate(0deg)'})
      $('.drop_zone#lower').show().animate({top: '+=56'}, 500).css({transform: 'rotate(180deg)'})
      rotateDouble(ui, el) 
  })
  
  moveDZ = (el, angle) ->
    console.log 'moveDZ'
    $(el).animate({'top':'-=74'}, 600) if angle == 'rotate(0deg)'
    $(el).animate({'top':'+=74'}, 600) if angle == 'rotate(180deg)'
    $(el).animate({'left':'-=74'}, 600) if angle == 'rotate(90deg)'
    $(el).animate({'left':'+=74'}, 600) if angle == 'rotate(270deg)'
  
  rotateDZ = (el, angle) ->
    console.log 'rotateDZ'
    $(el).animate({rotate: '+=90deg', left: '+=18', top: '+=18'}, 500) if parseInt( $(el).css('top') ) < 100 and angle == 'rotate(0deg)'
    $(el).animate({rotate: '+=90deg', left: '+=18', top: '+=18'}, 500) if parseInt( $(el).css('top') ) > 400 and angle == 'rotate(180deg)'
    $(el).animate({rotate: '+=90deg', left: '+=18', top: '+=18'}, 500) if parseInt( $(el).css('left') ) > 1000 and angle == 'rotate(90deg)'
    $(el).animate({rotate: '+=90deg', left: '+=18', top: '+=18'}, 500) if parseInt( $(el).css('top') ) < 300 and angle == 'rotate(270deg)'

  adjustDZdouble = (el, angle) ->
    console.log 'adjustDZdouble'
    $(el).animate({top:'+=37'}, 400) if angle == 'rotate(0deg)'
    $(el).animate({top:'-=37'}, 400) if angle == 'rotate(180deg)'
    $(el).animate({left:'-=37'}, 400) if angle == 'rotate(90deg)'
    $(el).animate({left:'+=37'}, 400) if angle == 'rotate(270deg)'
  
  adjustDouble = (ui, el, angle) ->
    console.log 'adjustDouble'
    $(ui.draggable[0]).animate({'top':'+=20'}, 400) if angle == 'rotate(0deg)'
    $(ui.draggable[0]).animate({'top':'-=20'}, 400) if angle == 'rotate(180deg)'
    $(ui.draggable[0]).animate({'left':'-=20'}, 400) if angle == 'rotate(90deg)'
    $(ui.draggable[0]).animate({'left':'+=20'}, 400) if angle == 'rotate(270deg)'
  
  rotateDouble = (ui, el, angle) ->
    $(ui.draggable[0]).animate({rotate: '+=90deg'}, 600, ->
      adjustDouble(ui, el, angle)
      adjustDZdouble(el, angle)
    )