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
    }
  }
});

module.exports = new Snack();