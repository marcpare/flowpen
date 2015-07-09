let State = require('ampersand-state');
let InletView = require('app/components/editor/inlet');
let Simulation = require('app/models/simulation');

let Inlet = State.extend({
  
  props: {
    segment: 'object',
    magnitude: 'number'
  },
 
  initialize (options) {
    
    let {segment} = options;
    this.segment = segment;
    
    this.magnitude = 10.0;
    
    this.view = new InletView({
      model: this
    });
    
    this.scale = 200.0;
    
    this.dx = this.segment.dy() * -1.0 / this.scale;
    this.dy = this.segment.dx() / this.scale;
    
    this.ux = this.dx * this.magnitude; 
    this.uy = this.dy * this.magnitude; 
        
    Simulation.addInlet({
      segment: this.segment.asGeom(),
      thickness: 2,
      ux: this.ux,
      uy: this.uy
    });
    
    this.on('change:magnitude', this.updateSimulation);
  },
  
  updateSimulation () {
    
    let ux = this.dx * this.magnitude; 
    let uy = this.dy * this.magnitude; 

    Simulation.addInlet({ 
      segment: this.segment.asGeom(),
      thickness: 2,
      ux: ux - this.ux,
      uy: uy - this.uy
    });
    
    this.ux = ux;
    this.uy = uy;
  },
  
});

module.exports = Inlet;