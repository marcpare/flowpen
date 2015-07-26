let View = require('ampersand-view');
let Simulation = require('app/models/simulation');

module.exports = View.extend({
  template: require('app/components/control-streamlines/streamlines-control.jade'),
    
  events: {
    'click': 'onClick'
  },
  
  onClick () {
    
    // // add a bunch of small lines to the simulation, centered on each cell
    // for (let x = 0; i < width; i++) {
    //   for (let y = 0; k < height; k++) {
    //     EditorObjects.add(new Streamline({
    //       x,
    //       y
    //     });
    //   }
    // }
    
  },
  
  initialize () {
  },
});