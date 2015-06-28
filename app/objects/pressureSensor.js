var colors = require('app/colors.js');

function PressureSensor (point, simulation) {
	var self = this;
	this.point = point;
	this.simulation = simulation;
	
  this.render();
	this.measure();
	window.setInterval(this.measure.bind(this), 10);
}

PressureSensor.prototype.render = function () {
	this.point.appendTo(APP.overlaygSnap).attr({
		strokeWidth: 0.5,
		stroke: colors.highlight,
		fill: 'none'
	});	
	
	var label = APP.overlaygSnap
		.text(this.point.x+2, this.point.y+1.2, "123.45 mPa")
		.addClass('sensor-label');
	
	this.label = label;
};

PressureSensor.prototype.measure = function () {
	this.label.node.innerHTML = p0(this.point.x, this.point.y).toPrecision(2);
};

module.exports = PressureSensor;