var	Arrow = require('./arrow.js'),
		geom = require('app/geom.js');

function Inlet (line) {
  this.type = OBJ_INLET;
  this.line = line;
  this.ux = 0;
  this.uy = 0;
}
Inlet.prototype.render = function (target) {
  var self = this,
      m = this.line.midpoint(),
      arrow,
      angle = this.line.angle(),
      inletLine = this.line,
      startT = 10;
  
  // Inlet line
  target.line(this.line.startX, this.line.startY, this.line.endX, this.line.endY).attr({
    stroke: '#bada55',
    strokeWidth: 2,
    strokeLinecap: 'round'
  });
      
  // Inlet direction arrow
  arrow = new Arrow(target, m.x, m.y, angle, startT);
  this.arrow = arrow;
  this.computeDeltas();
  
  (function () {
    /* Drag arrow perpendicular to line */
    var mouseLine = new geom.Line(m.x, m.y);
    arrow.drag(function () {
      mouseLine.end(APP.mouseAt.x, APP.mouseAt.y);
      var mouseAngle = mouseLine.angle() - angle;
      var d = (mouseAngle > 0 && mouseAngle < 180) ? -1 : 1;
      var t = geom.distToLine(geom.p(APP.mouseAt.x, APP.mouseAt.y), inletLine);
      arrow.resize(t*d);
      self.computeDeltas(); // maybe arrow should publish an event instead
    });
  })();
  
  this.applyToSim();
};
Inlet.prototype.clear = function () {
  // what about intersecting walls and inlets?
  // what about clearing intersecting walls?
  // just recompute sim wall/inlets on every change?
};
Inlet.prototype.computeDeltas = function () {
  // recalculate velocity vectors
  this.ux = this.arrow.dx()/10;
  this.uy = this.arrow.dy()/10;
};
Inlet.prototype.applyToSim = function () {
  var x, y, dist;
  for (x = 0; x < WIDTH; x++) {
    for (y = 0; y < HEIGHT; y++) {
      dist = geom.distToSegment(geom.p(x,y), this.line);
      if (dist < 2) {
        object(x, y, this);
      }
    }
  }
};

module.exports = Inlet;