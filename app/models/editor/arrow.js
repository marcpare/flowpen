let State = require('ampersand-state');
let ArrowView = require('app/components/editor/arrow');

let Arrow = State.extend({
  
  props: {
    x: 'number',
    y: 'number'
  },
  
  initialize () {
    this.view = new ArrowView({
      model: this
    });
  }
  
});

module.exports = Arrow;