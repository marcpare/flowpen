var BaseState = require('app/states/line-start_state.js');
var _ = require('underscore');
 
var PointStartState = _.extend({}, BaseState);

PointStartState.initialize = function (options) {
	
	var self = this;
	
	APP.snacksView.publish({
		message: 'Choose point',
		action: 'Cancel'
	});
	
	this.onPointEnd = options.onPointEnd || _.noop;
	this.onCancel = options.onCancel || _.noop;
	
	APP.cursor = 'node';
	
	APP.$canvas.one('click', function (e) {
		// point-ended
		APP.snacksView.clear();
		var point = APP.mouseAtPoint();
		if (self.onPointEnd) {
			self.onPointEnd(point);
		}
	});
	
};

PointStartState.cancel = function (options) {	
	APP.state.reset();
	APP.snacksView.clear();
	this.onCancel();
};

module.exports = PointStartState;