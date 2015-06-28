var BaseState = require('app/states/line-start_state.js');
var _ = require('underscore');

var LineStartState = _.extend({}, BaseState);

LineStartState.initialize = function (options) {
	var self = this;
	APP.snacksView.publish({
	  message: 'Choose starting point',
	  action: 'Cancel'
	});
	APP.cursor = 'node';
	APP.$canvas.one('click', function (e) {
	  var _options = {
	    start: APP.mouseAtPoint(),
			onLineEnd: options.onLineEnd
	  };
	  APP.state.transition('line-started', _options);
	});
	APP.traceNode.attr({
	  visibility: 'visible',
	  r: 6/APP.viewport.scale
	});      
};

module.exports = LineStartState;