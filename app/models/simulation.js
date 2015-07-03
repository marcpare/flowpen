var _ = require('underscore');

module.exports = {
  
  initialize (SimModule, el, options) {
    let simulation = SimModule(el, options);
    
    // Copy the return methods here
    _.extend(this, simulation);
  }
  
};