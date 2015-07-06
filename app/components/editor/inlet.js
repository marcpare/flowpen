let View = require('ampersand-view');
let SegmentView = require('app/components/editor/segment');
 
let Inlet = View.extend({
  
  create (svg) {
    this.segmentView = new SegmentView({
      model: this.model.segment
    });
    
    this.segmentView.create(svg);
  }
   
});

module.exports = Inlet;