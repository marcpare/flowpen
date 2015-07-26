let View = require('ampersand-view');
let Simulation = require('app/models/simulation');
 
module.exports = View.extend({
  
  create (svg) {
    
    this.svg = svg.group();
          
    // build a group of many tiny lines
        
    // A dream sort of syntax for this:
    // meshgrid(width, height).each(x, y => {
    //
    // });
      
    for (let x = 0; x < Simulation.width; x+=10) {
      for (let y = 0; y < Simulation.height; y+=10) {
        this.svg
          .line(x, y, x+1, y+1)
          .attr({
            stroke: '#bada55',
            strokeWidth: 0.5,
            strokeLinecap: 'round'
          });
      
      }
    }
    
    this.el = this.svg.node;
  },  
   
});