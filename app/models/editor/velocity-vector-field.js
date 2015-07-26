let State = require('ampersand-state');
let VelocityVectorFieldView = require('app/components/editor/velocity-vector-field');

module.exports = State.extend({
  
  props: {
  },
  
  initialize (options) {
    
    // let {} = options;
    
    this.view = new VelocityVectorFieldView({
      model: this
    });
  },
  
});