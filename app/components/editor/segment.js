let View = require('ampersand-view');
 
let Segment = View.extend({
  
  create (svg) {
    svg
      .line(this.model.x1, this.model.y1, this.model.x2, this.model.y2)
      .attr({
        stroke: '#bada55',
        strokeWidth: 2,
        strokeLinecap: 'round'
      });
  }
   
});

module.exports = Segment;