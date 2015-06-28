var BaseState = require('app/states/line-start_state.js');
var _ = require('underscore');

var LineEndedState = _.extend({}, BaseState);

LineEndedState.initialize = function (options) {
	var self = this;
	APP.snacksView.clear();
	this.currentLine = options.currentLine;
	
	var end = APP.mouseAtPoint();
	this.currentLine.end(end.x, end.y);

	if (options.onLineEnd) {
	  options.onLineEnd(this.currentLine);
	}
	APP.traceLine.attr({
	  visibility: 'hidden'
	});
	APP.traceNode.attr({
	  visibility: 'hidden'
	});
	options.startMarker.remove();
	APP.state.reset();
};

module.exports = LineEndedState;