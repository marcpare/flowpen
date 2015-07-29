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
      
    class VelocityVector {
      constructor (svg, x, y) {
        this.x = x;
        this.y = y;
        this.el = svg
          .line(0, 0, 3, 3)
          .attr({
            stroke: '#bada55',
            strokeWidth: 0.1,
            strokeLinecap: 'round'
          });
          
        this.el.transform(new Snap.Matrix()
          .translate(this.x, this.y)
          .toTransformString());
        
        this.update();
      }
      
      
      update () {
        
        let vel = Simulation.velocityAt(this.x, this.y);
        
        let mag = Math.pow(vel[0]*vel[0] + vel[1]*vel[1], 2);
        let dx = vel[0] / mag;
        let dy = vel[1] / mag;
        
        this.el.attr("x2", dx);
        this.el.attr("y2", dy);
             
      }
      
    }
    
    let vectors = [];
    
    for (let x = 1; x < Simulation.width; x+=8) {
      for (let y = 1; y < Simulation.height; y+=8) {
        vectors.push(new VelocityVector(this.svg, x, y));
      }
    }
    
    this.el = this.svg.node;
    
    // Kick off an update loop    
    window.setInterval(() => {
      vectors.forEach(vector => {
        vector.update();        
      });
    }, 500);
    
  },  
   
});