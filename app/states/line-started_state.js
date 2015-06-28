var BaseState = require('app/states/line-start_state.js');
var _ = require('underscore');
var geom = require('app/states/line-start_state.js');
var Line = geom.Line;

var LineStartedState = _.extend({}, BaseState);

LineStartedState.initialize = function (options) {
	var self = this;
  APP.snacksView.publish({
    message: 'Choose end point',
    action: 'Cancel'
  });
  this.currentLine = new Line(options.start.x, options.start.y);
  APP.$canvas.one('click', function (e) {
    APP.state.transition('line-ended', {
			onLineEnd: options.onLineEnd,
			currentLine: self.currentLine,
			startMarker: self.startMarker
		});    
  });
  APP.traceLine.attr({
    visibility: 'visible',
    x1: this.currentLine.startX, 
    y1: this.currentLine.startY, 
    x2: this.currentLine.startX, 
    y2: this.currentLine.startY,
    strokeWidth: 1/APP.viewport.scale
  });
  this.startMarker = APP.overlaygSnap
    .circle(this.currentLine.startX, 
            this.currentLine.startY, 
            6/APP.viewport.scale)
    .attr({
      fill: '#E91E63'
    });
};

module.exports = LineStartedState;