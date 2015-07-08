let View = require('ampersand-view');
let SegmentView = require('app/components/editor/segment');
let Arrow = require('app/models/editor/arrow');
 
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
  
  dragArrow (e) {
    
    console.log('got arrow drag event');
    
    // this.computeDeltas();
//
//       /* Drag arrow perpendicular to line */
//       var mouseLine = new geom.Line(m.x, m.y);
//       arrow.drag(function () {
//         mouseLine.end(APP.mouseAt.x, APP.mouseAt.y);
//         var mouseAngle = mouseLine.angle() - angle;
//         var d = (mouseAngle > 0 && mouseAngle < 180) ? -1 : 1;
//         var t = geom.distToLine(geom.p(APP.mouseAt.x, APP.mouseAt.y), inletLine);
//         arrow.resize(t*d);
//         self.computeDeltas(); // maybe arrow should publish an event instead
//       });
//
    
  }
   
});

module.exports = Inlet;