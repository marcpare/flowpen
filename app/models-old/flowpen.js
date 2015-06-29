let State = require('ampersand-state');

module.exports = State.extend({
  props: {
    id: 'string',
    title: 'string',
    options: 'object'
  }
});