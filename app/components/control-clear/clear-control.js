let View = require('ampersand-view');

module.exports = View.extend({
  template: require('app/components/control-clear/clear-control.jade'),
    
  events: {
    'click': 'onClick'
  },
  
  onClick () {
    console.log("I am going to clear....");
  },
  
  initialize () {
  },
});