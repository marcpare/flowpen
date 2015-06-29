let View = require('ampersand-view');
let Snack = require('app/models/snack');

module.exports = View.extend({
  template: require('app/components/snack/snack.jade'),
  
  bindings: {
    'model.visible': {
      type: 'toggle'
    }
  },
  
  events: {
    'click [data-hook=snack-action]': 'action'
  },
  
  action () {
    this.model.actionHandler();
  },
  
  initialize () {
    this.model = Snack;
    this.listenTo(this.model, 'change', this.render);
  }
});