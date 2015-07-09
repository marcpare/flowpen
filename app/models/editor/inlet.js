let State = require('ampersand-state');
let InletView = require('app/components/editor/inlet');
let Simulation = require('app/models/simulation');

let Inlet = State.extend({
  
  props: {
    segment: 'object',
    magnitude: 'number'
  },
 
  initialize (options) {
    
    let {segment: segment} = options;
    this.segment = segment;
    
    this.magnitude = 1.0;
    
    this.view = new InletView({
      model: this
    });
    
    this.dx = this.segment.dy() * -1.0;
    this.dy = this.segment.dx();
    
    this.ux = this.dx * this.magnitude / 100.0; 
    this.uy = this.dy * this.magnitude / 100.0; 
        
    Simulation.addInlet(
      this.segment.asGeom(), 
      2, 
      this.ux,
      this.uy);
    
    this.on('change:magnitude', this.updateSimulation);
  },
  
  updateSimulation () {
    
    let ux = this.dx * this.magnitude / 100.0; 
    let uy = this.dy * this.magnitude / 100.0; 

    Simulation.addInlet(
      this.segment.asGeom(),
      2,
      ux - this.ux,
      uy - this.uy
    );
    
    this.ux = ux;
    this.uy = uy;
  },
  
});

module.exports = Inlet;