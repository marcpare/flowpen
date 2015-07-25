let View = require('ampersand-view');
let Simulation = require('app/models/simulation');

module.exports = View.extend({
  template: require('app/components/control-streamlines/streamlines-control.jade'),
    
  events: {
    'click': 'onClick'
  },
  
  onClick () {
  },
  
  initialize () {
  },
});