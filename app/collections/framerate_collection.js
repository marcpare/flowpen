var Collection = require('ampersand-collection');
var State = require('ampersand-state');

var FrameRateModel = State.extend({
	props: {
		value: 'number'
	}
});

var FrameRateCollection = Collection.extend({
	model: FrameRateModel,
	size: 10,
	average: function () {
		return Math.round(this.reduce(function (acc, val) {
			return val.value+acc;
		}, 0) / this.length);
	}
});

var framerateCollection = new FrameRateCollection([]);

framerateCollection.on("add", function () {
	if (this.length > this.size) {
		this.remove(this.at(0));
	}
});

module.exports = framerateCollection;