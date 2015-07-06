let View = require('ampersand-view');
 
let Arrow = View.extend({
  
  create (svg) {
    this.svg = svg
      .line(this.model.x, this.model.y, this.model.x + 10, this.model.y + 10)
      .attr({
        stroke: '#bada55',
        strokeWidth: 1,
        strokeLinecap: 'round'
      });
    this.el = this.svg.node;
  },
   
});

module.exports = Arrow;