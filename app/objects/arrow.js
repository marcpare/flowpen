var PubSub = require('app/pubsub.js');
function Arrow (container, x, y, angle, t) {
  var self = this;
  this.container = container;
  this.events = new PubSub();
  this.x = x;
  this.y = y;
  this.t = t;
  this.angle = angle;
  this.g = container
    .group();
  this.el = this.g;
  this.hoverTarget = this.g
    .circle(0, 0, 10)
    .addClass('bound');
  this.line = this.g
    .line(0, 0, 0, 0)
    .addClass('arrow');
  this.resize(t);
  this.applyTransform();
  
  this.el.mouseover(function (e) {
    self.line.addClass('hover');
    self.hoverTarget.addClass('hover');
  });
  this.el.mouseout(function (e) {
    self.line.removeClass('hover');
    self.hoverTarget.removeClass('hover');
  });
  this.el.drag(function () {
    self.line.addClass('dragging');
    self.hoverTarget.addClass('dragging');
    self.hoverTarget.addClass('spectral');
    self.events.publish.apply(self.events, ['drag'].concat(arguments));
  }, function () {}, function () {
    // dragend
    self.line.removeClass('dragging');
    self.hoverTarget.removeClass('dragging');
    self.hoverTarget.removeClass('spectral');
  });
}
Arrow.prototype.applyTransform = function () {
  this.g.transform(new Snap.Matrix()
    .translate(this.x, this.y)
    .rotate(this.angle, 0, 0)
    .toTransformString());
};

Arrow.prototype.resize = function (t) {
  this.t = t;
  this.line.attr({y2: t});
  this.hoverTarget.attr({cy: t});	
};

Arrow.prototype.drag = function (callback) {
  this.events.subscribe('drag', callback);
};

// TODO: should probably fix angle to correspond with the trig functions. It's
// offset by 90 because angle=0 points up.
Arrow.prototype.dx = function () { return this.t*Math.cos((this.angle-90)*Math.PI/180); };
Arrow.prototype.dy = function () { return this.t*Math.sin((this.angle-90)*Math.PI/180); };


module.exports = Arrow;