let View = require('ampersand-view');
 
let Arrow = View.extend({
  
  create (svg) {
    
    this.svg = svg.group();
    
    this.segment = this.svg
      .line(0, 0, 0, 0)
      .attr({
        stroke: '#222222',
        strokeWidth: 1,
        strokeLinecap: 'round'
      });
      
    this.el = this.svg.node;
    
    this.update();
    
  },
  
  update () {
    
    this.svg.transform(new Snap.Matrix()
      .translate(this.model.start.x, this.model.start.y)
      .rotate(this.model.angle, 0, 0)
      .toTransformString());
    
    this.segment.attr({
      y2: this.model.magnitude
    });
      
  }
  
});

module.exports = Arrow;