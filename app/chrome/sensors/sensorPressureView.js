var View = require('ampersand-view'),
		State = require('ampersand-state'),
		ButtonBaseView = require('app/chrome/buttonBaseView.js'),
		PressureSensor = require('app/objects/pressureSensor.js');
		
module.exports = ButtonBaseView.extend({
	events: {
		'click': 'handleClick'
	},
	initialize: function () {
		ButtonBaseView.prototype.initialize.apply(this, arguments);
		this.model.text = 'Pressure';
	},
	handleClick: function () {
		var self = this;
		
		if (this.model.selected) {
			APP.state.trigger('cancel');
			this.model.selected = false;
			return;
		} 
		
		this.model.selected = true;
	  APP.state.transition('point-start', {
	    onPointEnd: function (point) {
				self.model.selected = false;
	      APP.objects.push(new PressureSensor(point));
	    },
			onCancel: function () {
				self.model.selected = false;
			}
	  });
	}
});