var View = require('ampersand-view'),
		State = require('ampersand-state');
		
var SnackModel = State.extend({
	props: {
		visible: {
			type: 'boolean'
		},
		message: {
			type: 'string'
		},
		action: {
			type: 'string'
		}
	}
});

module.exports = View.extend({
	template: require('app/templates/snack.jade'),
	bindings: {
		'model.visible': {
			type: 'toggle'
		}
	},
	events: {
		'click [role=snack-action]': 'cancel'
	},
	initialize: function () {
		this.model = new SnackModel();
		this.listenTo(this.model, 'change', this.render);
	},
	cancel: function () {
		APP.state.trigger(this.model.action);
	},
	publish: function (data) {
		this.model.message = data.message;
		this.model.action = data.action;
		this.model.visible = true;
	},
	clear: function () {
		this.model.visible = false;
	},
	render: function () {
		this.renderWithTemplate(this);
	}
});