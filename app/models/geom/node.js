let State = require('ampersand-state');
let NodeView = require('app/components/geom/node');

let Node = State.extend({
  
  props: {
    x: 'number',
    y: 'number'
  },
  
  initialize () {
    this.view = new NodeView({
      model: this
    });
  }
  
});

module.exports = Node;