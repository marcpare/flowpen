var _ = require('underscore');
var EditorObjects = require('app/models/editor-objects');

module.exports = {

  initialize (SimModule, el, options) {

    // Previous implementation as a function:
    // let simulation = SimModule(el, options);

    let simulation = new SimModule();
    simulation.initialize(el, options);

    this.height = options.rows;
    this.width = options.columns;

    // Copy the return methods here
    _.extend(this, simulation);

    simulation.start();
  },

  clear () {

    EditorObjects.forEach(o => {
      o.destroy();
    });

    EditorObjects.reset();

  },

};