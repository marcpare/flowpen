let State = require('ampersand-state');
let InletView = require('app/components/editor/inlet');
let Simulation = require('app/models/simulation');

let Inlet = State.extend({
  
  props: {
    segment: 'object'
  },
  
  initialize (options) {
    
    let {segment: segment} = options;
    this.segment = segment;
    
    this.view = new InletView({
      model: this
    });
     
    Simulation.addInlet(
      this.segment.segment(), 
      2, 
      -1.0*this.segment.segment().dy(), 
      this.segment.segment().dx());
  }
  
});

module.exports = Inlet;