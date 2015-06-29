let View = require('ampersand-view');
let Snack = require('app/models/snack');

module.exports = View.extend({
  template: require('app/templates/snack.jade'),
  
  bindings: {
    'model.visible': {
      type: 'toggle'
    }
  },
  
  events: {
    'click [role=snack-action]': 'cancel'
  },
  
  cancel () {
    APP.state.trigger(this.model.action);
  },
  
  initialize () {
    this.model = Snack;
    this.listenTo(this.model, 'change', this.render);
  },
  
  publish (data) {
    this.model.message = data.message;
    this.model.action = data.action;
    this.model.visible = true;
  },
  
  clear () {
    this.model.visible = false;
  }
});