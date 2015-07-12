let State = require('ampersand-state');
let InletView = require('app/components/editor/inlet');
let Simulation = require('app/models/simulation');
let Segment = require('app/models/editor/segment');

let Inlet = State.extend({
  
  props: {
    segment: 'object',
    magnitude: 'number'
  },
 
  initialize (options) {
    
    let {segment, stateString} = options;
    
    if (stateString) {
      // bit of a hack, ignore the last element
      this.segment = new Segment({stateString: stateString});
      let sp = stateString.split(",");
      this.magnitude = parseInt(sp[4]);
    } else {
      this.segment = segment;
      this.magnitude = 10.0;
    }
        
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
    
    // Don't want to retrigger the change event that
    // got us here.
    this.set('magnitude', Math.round(this.magnitude), {silent: true});
    
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
  
  urlSerialize () {
    return `I${this.segment.urlSerializeCoords()},${this.magnitude}`;
  },
  
  destroy () {
    
    this.view.remove();
    
    Simulation.addInlet({ 
      segment: this.segment.asGeom(),
      thickness: 2,
      ux: -this.ux,
      uy: -this.uy
    });
    
  },
  
});

module.exports = Inlet;