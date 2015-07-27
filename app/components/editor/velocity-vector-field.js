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
          .line(0, 0, 1, 1)
          .attr({
            stroke: '#bada55',
            strokeWidth: 0.1,
            strokeLinecap: 'round'
          });
        
        this.update();
      }
      
      
      update () {
        
        this.el.transform(new Snap.Matrix()
          .translate(this.x, this.y)
          .rotate(Math.random()*360, 0, 0)
          .toTransformString());
        
        // let angle = Geom.angle(velocity.x, velocity.y);
        // this.angle = angle.
        // this.updateTransform();
        
      }
      
    }
    
    let vectors = [];
    
    for (let x = 1; x < Simulation.width; x+=3) {
      for (let y = 1; y < Simulation.height; y+=3) {
        vectors.push(new VelocityVector(this.svg, x, y));
      }
    }
    
    this.el = this.svg.node;
    
    // Kick off an update loo    
    window.setInterval(() => {
      
      vectors.forEach(vector => {
        console.log('updating;');
        // vector.update(Simulation.velocityAt(vector.x, vector.y));
        
      });
      
    }, 500);
    
  },  
   
});