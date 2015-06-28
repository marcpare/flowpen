var States = require('app/states');
module.exports = {
  label: 'initial',
	trigger: function (event, options) {
		return this.state.trigger(event, options);
	},
	reset: function () {
		this.state = null;
	},
  transition: function (state, options) {
    options = options || {};
    this.label = state;
		var newState = States[state];
		newState.initialize(options);
		this.state = newState;
  }
};