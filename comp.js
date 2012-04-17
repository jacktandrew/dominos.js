var boneBuilder, boneyard, draw, fabricate, makePips;

boneyard = [];

boneBuilder = function(a, b) {
  boneyard.push('_' + a + '_' + b);
  if (b === 0) {
    return boneyard;
  }
  if (a === 0) {
    a = b;
    b--;
  }
  return boneBuilder(a - 1, b);
};

draw = function(n) {
  var randomDraw, value, _i, _len, _results;
  randomDraw = _.shuffle(boneyard).splice(0, n);
  _results = [];
  for (_i = 0, _len = randomDraw.length; _i < _len; _i++) {
    value = randomDraw[_i];
    _results.push(fabricate(value));
  }
  return _results;
};

makePips = function(x) {
  var starter;
  starter = "<div></div>";
  if (x < 1) {
    return '';
  } else {
    return starter.concat(makePips(x - 1));
  }
};

fabricate = function(string) {
  var bottom, domino, template, top;
  top = makePips(+string.charAt(1));
  bottom = makePips(+string.charAt(3));
  template = _.template("      <div class='tile draggable'>        <div class='pips <%= pair.slice(0,2) %>'>          <%= topPips %>        </div>        <div class='bar'></div>        <div class='pips <%= pair.slice(2,4) %>'>          <%= bottomPips %>        </div>      </div>");
  domino = template({
    pair: string,
    topPips: top,
    bottomPips: bottom
  });
  return $('#boneyard').append(domino);
};

$(function() {
  var adjustDZdouble, adjustDouble, dropAsign, moveDZ, rotateDZ, rotateDouble;
  boneBuilder(6, 6);
  draw(28);
  $(".tile").dblclick(function() {
    return $(this).animate({
      rotate: '+=90deg'
    }, 500, function() {
      var bottom, top;
      if ('rotate(0deg)' === $(this).css('transform') || 'rotate(180deg)' === $(this).css('transform')) {
        top = $(this).children()[0];
        bottom = $(this).children()[2];
        return $(this).css({
          transform: 'rotate(0deg)'
        }).prepend(bottom).append(top);
      }
    });
  });
  $(".draggable").draggable({
    revert: "invalid",
    zIndex: 10,
    snap: ".drop_zone",
    snapMode: "inner"
  });
  dropAsign = function(num, pos) {
    var ident;
    if (pos === 'last') {
      ident = 'upper';
    }
    if (pos === 'first') {
      ident = 'lower';
    }
    return $(".drop_zone#" + ident).attr('rel', num).droppable({
      accept: ".tile:has(.pips:" + pos + "-child._" + num + ")",
      tolerance: 'fit',
      activeClass: "ui-state-hover",
      drop: function(event, ui) {
        var angle, el;
        el = this;
        angle = $(el).css('transform');
        moveDZ(el, angle);
        rotateDZ(el, angle);
        $(ui.draggable[0]).draggable("option", "disabled", true).removeClass('ui-draggable draggable');
        if (ui.draggable[0].children[0].childElementCount === ui.draggable[0].children[2].childElementCount) {
          rotateDouble(ui, el, angle);
        }
        if (pos === 'last') {
          console.log('pos is last');
          dropAsign(ui.draggable[0].firstElementChild.childElementCount, pos);
        }
        if (pos === 'first') {
          console.log('pos is first');
          return dropAsign(ui.draggable[0].lastElementChild.childElementCount, pos);
        }
      }
    });
  };
  $('.drop_zone#starter').droppable({
    accept: ".tile:has(._6 ~ ._6)",
    tolerance: 'fit',
    activeClass: "ui-state-hover",
    drop: function(event, ui) {
      var el;
      el = this;
      $(ui.draggable[0]).draggable("option", "disabled", true).removeClass('ui-draggable draggable');
      $(this).hide();
      dropAsign(6, 'first');
      dropAsign(6, 'last');
      $('.drop_zone#upper').show().animate({
        top: '-=56'
      }, 500).css({
        transform: 'rotate(0deg)'
      });
      $('.drop_zone#lower').show().animate({
        top: '+=56'
      }, 500).css({
        transform: 'rotate(180deg)'
      });
      return rotateDouble(ui, el);
    }
  });
  moveDZ = function(el, angle) {
    console.log('moveDZ');
    if (angle === 'rotate(0deg)') {
      $(el).animate({
        'top': '-=74'
      }, 600);
    }
    if (angel === 'rotate(180deg)') {
      $(el).animate({
        'top': '+=74'
      }, 600);
    }
    if (angel === 'rotate(90deg)') {
      $(el).animate({
        'left': '-=74'
      }, 600);
    }
    if (angel === 'rotate(270deg)') {
      return $(el).animate({
        'left': '+=74'
      }, 600);
    }
  };
  rotateDZ = function(el, angle) {
    console.log('rotateDZ');
    if (parseInt($(el).css('top')) < 100 && angle === 'rotate(0deg)') {
      $(el).animate({
        rotate: '+=90deg',
        left: '+=18',
        top: '+=18'
      }, 500);
    }
    if (parseInt($(el).css('top')) > 400 && angle === 'rotate(180deg)') {
      $(el).animate({
        rotate: '+=90deg',
        left: '+=18',
        top: '+=18'
      }, 500);
    }
    if (parseInt($(el).css('left')) > 1000 && angle === 'rotate(90deg)') {
      $(el).animate({
        rotate: '+=90deg',
        left: '+=18',
        top: '+=18'
      }, 500);
    }
    if (parseInt($(el).css('top')) < 300 && angle === 'rotate(270deg)') {
      return $(el).animate({
        rotate: '+=90deg',
        left: '+=18',
        top: '+=18'
      }, 500);
    }
  };
  adjustDZdouble = function(el, angle) {
    console.log('adjustDZdouble');
    if (angle === 'rotate(0deg)') {
      $(el).animate({
        top: '+=37'
      }, 400);
    }
    if (angle === 'rotate(180deg)') {
      $(el).animate({
        top: '-=37'
      }, 400);
    }
    if (angle === 'rotate(90deg)') {
      $(el).animate({
        left: '-=37'
      }, 400);
    }
    if (angle === 'rotate(270deg)') {
      return $(el).animate({
        left: '+=37'
      }, 400);
    }
  };
  adjustDouble = function(ui, el, angle) {
    console.log('adjustDouble');
    if (angle === 'rotate(0deg)') {
      $(ui.draggable[0]).animate({
        'top': '+=20'
      }, 400);
    }
    if (angle === 'rotate(180deg)') {
      $(ui.draggable[0]).animate({
        'top': '-=20'
      }, 400);
    }
    if (angle === 'rotate(90deg)') {
      $(ui.draggable[0]).animate({
        'left': '-=20'
      }, 400);
    }
    if (angle === 'rotate(270deg)') {
      return $(ui.draggable[0]).animate({
        'left': '+=20'
      }, 400);
    }
  };
  return rotateDouble = function(ui, el, angle) {
    return $(ui.draggable[0]).animate({
      rotate: '+=90deg'
    }, 600, function() {
      adjustDouble(ui, el, angle);
      return adjustDZdouble(el, angle);
    });
  };
});