let State = require('ampersand-state');
    
let Cursor = State.extend({
  props: {
    x: {
      type: 'number'
    },
    y: {
      type: 'number'
    }
  }
});

module.exports = new Cursor();