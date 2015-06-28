var View = require('ampersand-view'),
    State = require('ampersand-state');
    
var ButtonModel = State.extend({
  props: {
    text: {
      type: 'string',
      default: 'placeholder'
    },
    selected: {
      type: 'boolean',
      default: false
    }
  }
});

module.exports = View.extend({
  template: require('app/templates/button.jade'),
  bindings: {
    'model.text': '[data-hook=text]',
    'model.selected': {
      type: 'booleanClass',
      name: 'tool-button-selected'
    }
  },
  initialize: function () {
    this.model = new ButtonModel();
  }
});