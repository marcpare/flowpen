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
     
    Simulation.addInlet(this.segment.segment(), 2, 3, 0);
  }
  
});

module.exports = Inlet;