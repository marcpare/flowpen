let State = require('ampersand-state');
let InletView = require('app/components/editor/inlet');

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
  }
  
});

module.exports = Inlet;