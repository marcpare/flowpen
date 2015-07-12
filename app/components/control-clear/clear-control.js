let View = require('ampersand-view');
let Simulation = require('app/models/simulation');

module.exports = View.extend({
  template: require('app/components/control-clear/clear-control.jade'),
    
  events: {
    'click': 'onClick'
  },
  
  onClick () {
    Simulation.clear();
  },
  
  initialize () {
  },
});