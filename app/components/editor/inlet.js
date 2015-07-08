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
    
  }
   
});

module.exports = Inlet;