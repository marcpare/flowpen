let View = require('ampersand-view');
let SegmentView = require('app/components/editor/segment');
let Arrow = require('app/models/editor/arrow');
let Cursor = require('app/models/cursor');
let Geom = require('app/lib/geom');
 
let Inlet = View.extend({
  
  create (svg) {
    
    this.model.segment.view.create(svg);
    
    this.arrow = new Arrow({
      start: this.model.segment.midpoint(),
      angle: this.model.segment.angle()
    });
        
    this.arrow.view.create(svg);
    
    this.listenTo(this.arrow.view, 'drag', this.dragArrow);
  },
  
  dragArrow () {
    
    let segment = this.model.segment;
    let direction = segment.dy() * (Cursor.x - segment.x1) - 
                    segment.dx() * (Cursor.y - segment.y1);
    direction = Math.sign(direction);
    
    this.arrow.magnitude = direction * Geom.distToLine(
      Geom.p(Cursor.x, Cursor.y),
      this.model.segment.segment()
    );
        
  }
   
});

module.exports = Inlet;