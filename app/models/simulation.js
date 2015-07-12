var _ = require('underscore');
var EditorObjects = require('app/models/editor-objects');

module.exports = {
  
  initialize (SimModule, el, options) {
    let simulation = SimModule(el, options);
    
    // Copy the return methods here
    _.extend(this, simulation);
  },
  
  clear () {
    
    EditorObjects.forEach(o => {
      o.destroy();
    });
    
    // EditorObjects.reset();
    
  },
  
};