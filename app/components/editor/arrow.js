let View = require('ampersand-view');
 
let Arrow = View.extend({
  
  create (svg) {
    
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
    
    this.svg.mouseover(e => {

      this.segment.addClass('hover');
      this.hoverTarget.addClass('hover');

    });
    
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