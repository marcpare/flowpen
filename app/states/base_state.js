
var State = {
	name: 'base state',
	trigger: function (event, options) {
		event = event.toLowerCase();
		if (this[event]) {
			this[event].call(this, options);
		} else {
			// raise error?
			// log missing state?
		}
	}
};

module.exports = State;