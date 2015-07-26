let View = require('ampersand-view');
 
module.exports = View.extend({

  create (svg) {    
    this.svg = svg
      .line(0, 0, 10, 10)
      .attr({
        stroke: '#bada55',
        strokeWidth: 2,
        strokeLinecap: 'round'
      });
    
    this.el = this.svg.node;
    // this.listenTo(this.model, 'change', this.update.bind(this));
  },  
   
});