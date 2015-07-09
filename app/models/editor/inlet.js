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
    
    this.view = new InletView({
      model: this
    });
    
    // TODO: api for this can be improved...
    this.dx = -1.0*this.segment.segment().dy(); 
    this.dy = this.segment.segment().dx(); 
    
    Simulation.addInlet(
      this.segment.segment(), 
      2, 
      this.dx*this.view.arrow.magnitude, 
      this.dy*this.view.arrow.magnitude);
  },
  
  updateSimulation () {

    let ux = -1.0*this.segment.segment().dy(); 
    let uy = this.segment.segment().dx(); 
    
    let a = this.view.arrow.magnitude;
    
    ux *= a;
    uy *= a;
    
    Simulation.addInlet(
      this.segment.segment(),
      2,
      ux - this.ux,
      uy - this.uy
    );
    
    this.ux = ux;
    this.uy = uy;
  },
  
});

module.exports = Inlet;