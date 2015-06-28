var colors = require('app/colors.js');
var geom = require('app/geom.js');
var hud = require('app/hud.js');

class VelocitySensor {
	constructor (point, simulation) {
		this.point = point;
		this.angle = 10.0;
		this.simulation = simulation;
	
	  this.render();
		this.measure();
		window.setInterval(this.measure.bind(this), 10);
	}
	
	render () {
		this.g = hud.group();
		this.line = this.g
			.line(0, 0, 0, 2)
			.attr({
				strokeWidth: 0.5,
				stroke: colors.highlight
			});
		this.applyTransform();
		this.label = hud
			.text(this.point.x+2, this.point.y+1.2, "123.45 m/s")
			.addClass('sensor-label');
	}
	
	measure () {
		let v = geom.dist(0, 0,
			u0x(this.point.x, this.point.y),
			u0y(this.point.x, this.point.y));
			
		this.angle = geom.angle(
			u0x(this.point.x, this.point.y), 
			u0y(this.point.x, this.point.y), 0, 0) - 90;
		
		this.applyTransform();
		this.label.node.innerHTML = v.toPrecision(2);
	}
	
	applyTransform () {
		this.g.transform(`translate(${this.point.x} ${this.point.y}) 
										  rotate(${this.angle})`);
	}
}

module.exports = VelocitySensor;