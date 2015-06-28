/*

This is just a sketch of the API...


*/

var Backbone = require('Backbone'),
		ToolButtonMixins = require('ToolButtonMixins');

ToolButtonMixins = {
	initialize: function () {
		this.state = new Backbone.Model();
	},
	select: function () {
		this.state.set('selected', true);
	},
	deselect: function () {
		this.state.set('selected', false);
	},
	render: function () {
		this.$el.html(this.template({data:this.state.toJSON()}));
	}
};

ToolView = Backbone.View.extend({
	mixins: ToolButtonMixins,
	el: '[role=tool-inlet]',
	events: {
		'click': click
	},
	click: function () {
	  var self = this;
		
		self.model.set('selected', false);
		
		self.$el.addClass('tool-button-selected');
	  APP.state.transition('line-start', {
	    onLineEnd: function (line) {
	      var inlet = new Inlet(line);
	      $(self).removeClass('tool-button-selected');
	      APP.objects.push(inlet);
	      inlet.render(APP.overlaygSnap);
	    }
	  });
	}
});