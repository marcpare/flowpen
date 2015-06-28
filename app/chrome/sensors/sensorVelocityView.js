var View = require('ampersand-view'),
		State = require('ampersand-state'),
		ButtonBaseView = require('app/chrome/buttonBaseView.js'),
		VelocitySensor = require('app/objects/velocitySensor.js');
		
module.exports = ButtonBaseView.extend({
	events: {
		'click': 'handleClick'
	},
	initialize () {
		ButtonBaseView.prototype.initialize.apply(this, arguments);
		this.model.text = 'Velocity';
	},
	handleClick () {
		var self = this;
		
		if (this.model.selected) {
			APP.state.trigger('cancel');
			this.model.selected = false;
			return;
		}
		
		this.model.selected = true;
	  APP.state.transition('point-start', {
	    onPointEnd (point) {
				self.model.selected = false;
	      APP.objects.push(new VelocitySensor(point));
	    },
			onCancel () {
				self.model.selected = false;
			}
	  });
	}
});