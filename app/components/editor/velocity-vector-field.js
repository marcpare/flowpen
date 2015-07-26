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
    //
    // Another idea: Cartesian Join
    //
    // _.join(_.range(width), _.range(height)).each(x, y => {
    //
    // })
      
    for (let x = 1; x < Simulation.width; x+=3) {
      for (let y = 1; y < Simulation.height; y+=3) {
        this.svg
          .line(x, y, x+1, y+1)
          .attr({
            stroke: '#bada55',
            strokeWidth: 0.1,
            strokeLinecap: 'round'
          });
      
      }
    }
    
    this.el = this.svg.node;
  },  
   
});