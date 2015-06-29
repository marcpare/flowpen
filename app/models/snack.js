let State = require('ampersand-state');
    
let Snack = State.extend({
  props: {
    visible: {
      type: 'boolean'
    },
    message: {
      type: 'string'
    },
    action: {
      type: 'string'
    },
    actionHandler: {
      type: 'function'
    }
  }
});

module.exports = new Snack();