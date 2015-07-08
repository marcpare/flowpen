let View = require('ampersand-view');
let Model = require('ampersand-state');
let Cursor = require('app/models/cursor');

let ArrowViewState = Model.extend({
  props: {
    dragging: {
      type: 'boolean',
      default: false
    }
  }
});

let Arrow = View.extend({
  
  events: {
    'mouseover': 'mouseover',
    'mouseout': 'mouseout',
    'mousedown': 'dragStart',
    'mouseup': 'dragEnd'
  },
  
  mouseover (e) {
    this.segment.addClass('hover');
    this.hoverTarget.addClass('hover');
  },
  
  mouseout (e) {
    this.segment.removeClass('hover');
    this.hoverTarget.removeClass('hover');
  },
  
  dragStart (e) {
    this.state.dragging = true;
    this.listenTo(Cursor, 'change', this.mousemove);
  },
  
  dragEnd (e) {
    this.state.dragging = false;
    this.stopListening(Cursor, 'change');
  },
  
  mousemove () {
    if (this.state.dragging) this.trigger('drag');
  },
  
  create (svg) {
    
    this.state = new ArrowViewState();
    
    this.svg = svg.group();
    
    this.segment = this.svg
      .line(0, 0, 0, 0)
      .attr({
        stroke: '#222222',
        strokeWidth: 0.5,
        strokeLinecap: 'round'
      })
      .addClass('arrow');
    
    this.hoverTarget = this.svg
      .circle(0, 0, 10)
      .addClass('bound');
    
    this.el = this.svg.node;
    
    this.update();
    
    this.listenTo(this.model, 'change', this.update);
        
  },
  
  update () {
    
    this.svg.transform(new Snap.Matrix()
      .translate(this.model.start.x, this.model.start.y)
      .rotate(this.model.angle, 0, 0)
      .toTransformString());
    
    this.segment.attr({
      y2: this.model.magnitude
    });
    
    this.hoverTarget.attr({
      cy: this.model.magnitude
    });
      
  }
  
});

module.exports = Arrow;