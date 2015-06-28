// globals: Snap
var View = require('ampersand-view');
var State = require('ampersand-state');

module.exports = View.extend({
	template: require('app/templates/framerate.jade'),
	initialize: function (options) {
		this.padding = 3;
		this.width = options.width;
		this.height = options.height;
		this.yaxis = options.yaxis;
		this.points = options.points;
		this.dx = (this.width-this.padding*2) / this.points;
		this.dy = (this.height-this.padding*2) / (this.yaxis[1] - this.yaxis[0]);
		this.pointStyle = {
			fill: '#bada55'
		};
		this.R = 1.8;
		this.listenTo(this.collection, 'add', this.render);
	},
	render: function () {
		this.el.innerHTML = this.template(this);
		this.svg = this.query('svg');
		this.snap = Snap(this.svg);		
		this.snap.clear();
		this.collection.forEach(function (point, i) {
			this.snap.circle(
				this.dx*i+this.padding, 
				this.height-(point.value*this.dy)-this.padding, 
				this.R).attr(this.pointStyle);
		}, this);
	}
});
