let State = require('ampersand-state');
    
let Cursor = State.extend({
  props: {
    x: {
      type: 'number',
      default: -100
    },
    y: {
      type: 'number',
      default: -100
    },
    pointer: {
      type: 'string',
      values: ['none', 'trace-node'],
      default: 'none'
    }
  }
});

module.exports = new Cursor();