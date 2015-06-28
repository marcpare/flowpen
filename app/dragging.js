var $ = require('jquery');

module.exports = function (el, options) {
  var $el, panning, dragging, startX, startY, dx, dy, lastDx, lastDy, shiftOption;
  options = options || {};
  $el = $(el);
  shiftOption = options.shift || false;
  
  if (shiftOption) {
    $el.on('keydown', function (e) {
      if (e.shiftKey) { 
        $('body').css('cursor', 'move');
        panning = true;
      }
    });

    $el.on('keyup', function (e) {
      if (!e.shiftKey) { 
        $('body').css('cursor', 'auto');
        panning = false;
      }
    });
  }

  $el.on('mousedown', function (e) {
    dragging = true;
    if (panning || !shiftOption) {
      startX = e.clientX;
      startY = e.clientY;
      lastDx = 0;
      lastDy = 0;
    }
  });
  
  $el.on('mouseup', function () {
    dragging = false;
  });

  $el.on('mousemove', function (e) {
    if (panning && dragging || (dragging && !shiftOption)) {
      dx = e.clientX-startX;
      dy = e.clientY-startY;
      $el.trigger('drag', {
        dx: dx,
        dy: dy,
        ddx: dx-lastDx,
        ddy: dy-lastDy
      });      
      lastDx = dx;
      lastDy = dy;
    }
  });
};