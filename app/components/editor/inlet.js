let View = require('ampersand-view');
let SegmentView = require('app/components/editor/segment');
let Arrow = require('app/models/editor/arrow');
let Cursor = require('app/models/cursor');
let Geom = require('app/lib/geom');
 
let Inlet = View.extend({
  
  initialize (options) {
    let {svg} = options;
    this.svg = svg;
    
    this.model.segment.view.create(this.svg);
    
    this.arrow = new Arrow({
      start: this.model.segment.midpoint(),
      angle: this.model.segment.angle(),
      magnitude: this.model.magnitude
    });
        
    this.arrow.view.create(svg);
    
    this.listenTo(this.arrow.view, 'drag', this.dragArrow);
    this.listenTo(this.arrow, 'change:magnitude', this.updateMagnitude);
        
    this.listenTo(this, 'remove', this.cleanup);
  },
    
  updateMagnitude () {
    this.model.magnitude = this.arrow.magnitude;
  },
  
  dragArrow () {
    
    let direction = this.model.segment.direction(Geom.p(Cursor.x, Cursor.y));
    
    this.arrow.magnitude = direction * Geom.distToLine(
      Geom.p(Cursor.x, Cursor.y),
      this.model.segment.segment()
    );
        
  },
  
  cleanup () {
    console.log('cleaning up the inlet view');
  },
   
});

module.exports = Inlet;