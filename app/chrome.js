var $ = require('jquery'),
		visualizations   = require('./visualizations'),
		Dragging = require('app/dragging.js'),
		Inlet = require('app/objects/inlet.js'),
		Wall = require('app/objects/wall.js');
	
function attachEvents () {
	
	$(window).resize(function (e) {
	  APP.viewport.setCanvasBounds(APP.windowWidth(), APP.windowHeight());
	});

	drag = new Dragging(window, {shift:true});
	$(window).on('drag', function (e, deltas) {
	  APP.viewport.panByPixels(deltas.ddx, deltas.ddy);
	});
	
	$('[role=visualizations]').html(
	  JST.visualizations({
	    selected: APP.visualization,
	    items: [
	      {label:'Combined', fn: 'cool'},
	      {label:'Velocity', fn: 'velocity'},
	      {label:'Pressure', fn: 'pressure'}
	    ]
	  })
	);
	
	$('[role=visualization]').change(function (e) {
	  APP.viz = visualizations[$(this).val()];
	});   
	
	$('[role=tool-wall]').click(function (e) {
	  var self = this;
	  $(this).addClass('tool-button-selected');
	  APP.state.transition('line-start', {
	    onLineEnd: function (line) {
	      $(self).removeClass('tool-button-selected');
	      APP.objects.push(new Wall(line));
	    }
	  });
	});

	$('[role=tool-inlet]').click(function (e) {
	  var self = this;
	  $(this).addClass('tool-button-selected');
	  APP.state.transition('line-start', {
	    onLineEnd: function (line) {
	      var inlet = new Inlet(line);
	      $(self).removeClass('tool-button-selected');
	      APP.objects.push(inlet);
	      inlet.render(APP.overlaygSnap);
	    }
	  });
	});
	
	$('[role=sensor-velocity]').click(function (e) {
	  var self = this;
	  $(this).addClass('tool-button-selected');
	});	
}

function init () {
	attachEvents();
}

module.exports = init;