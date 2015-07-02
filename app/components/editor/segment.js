let View = require('ampersand-view');
 
let Segment = View.extend({
  
  create (svg) {
    this.svg = svg
      .line(this.model.x1, this.model.y1, this.model.x2, this.model.y2)
      .attr({
        stroke: '#bada55',
        strokeWidth: 10,
        strokeLinecap: 'round'
      });
    this.el = this.svg.node;
    this.listenTo(this.model, 'change', this.update.bind(this));
  },
  
  update () {
    this.svg.attr({
      x1: this.model.x1,
      y1: this.model.y1,
      x2: this.model.x2,
      y2: this.model.y2
    });
  }
   
});

module.exports = Segment;