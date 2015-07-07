let View = require('ampersand-view');
 
let Arrow = View.extend({
  
  create (svg) {
    this.svg = svg
      .line(this.model.start.x, this.model.start.y, this.model.start.x + 10, this.model.start.y + 10)
      .attr({
        stroke: '#222222',
        strokeWidth: 1,
        strokeLinecap: 'round'
      });
    this.el = this.svg.node;
  },
   
});

module.exports = Arrow;