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
  },
  
  clear () {
    this.visible = false;
    this.message = '';
    this.action = '';
    this.actionHandler = false;
  }
});

module.exports = new Snack();