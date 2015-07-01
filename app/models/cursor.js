let State = require('ampersand-state');
    
let Cursor = State.extend({
  props: {
    x: {
      type: 'number'
    },
    y: {
      type: 'number'
    },
    pointer: {
      type: 'string',
      values: ['none', 'trace-node']
    }
  }
});

module.exports = new Cursor();