// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function p (x, y) { return {x:x, y:y}; }
function dist (x1, y1, x2, y2) { return Math.sqrt(sqr(x2-x1) + sqr(y2-y1)); }

/* returns degrees */
function angle (x1, y1, x2, y2) { return Math.atan2(y2-y1, x2-x1)*180/Math.PI; }

function sqr(x) { return x * x; }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y); }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 === 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, line) { 
  return Math.sqrt(distToSegmentSquared(p, line.startP(), line.endP())); 
}

function distToLine (a, line) {
  // http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
  // a0, v1, w2
  var v = p(line.startX, line.startY),
      w = p(line.endX, line.endY),
      dx = w.x-v.x,
      dy = w.y-v.y;
  return Math.abs(dy*a.x - dx*a.y + w.x*v.y - w.y*v.x) / line.length();
}

function Point (x, y) {
  this.x = x;
  this.y = y;
}
Point.prototype.appendTo = function (container) {
  return container.circle(0, 0, 0).attr({
    cx: this.x,
    cy: this.y,
    r: 1
  });
};

function Line (startX, startY, endX, endY) {
  this.startX = startX;
  this.startY = startY;
  if (endX && endY) {
    this.endX = endX;
    this.endY = endY;
  } else {
    this.incomplete = true;
  }
}
Line.prototype.startP = function () { return p(this.startX, this.startY); };
Line.prototype.endP = function () { return p(this.endX, this.endY); };
Line.prototype.dx = function () { return this.endX - this.startX; };
Line.prototype.dy = function () { return this.endY - this.startY; };
Line.prototype.length = function () {
  return Math.sqrt(sqr(this.dy())+sqr(this.dx()));
};
Line.prototype.end = function (endX, endY) {
  this.endX = endX;
  this.endY = endY;
};
Line.prototype.midpoint = function () {
  return {
    x: (this.startX+this.endX)/2,
    y: (this.startY+this.endY)/2
  };
};
/* return degrees */
Line.prototype.angle = function () {
  var dx = (this.startX-this.endX),
      dy = (this.startY-this.endY);
  return Math.atan2(dy, dx)*180/Math.PI;
};
Line.prototype.append = function (container) {
  return container.line(this.startX, this.startY, this.endX, this.endY);
};

module.exports = {
  p,
  dist,
  angle,
  distToSegment,
  distToLine,
  Line,
  Point
};