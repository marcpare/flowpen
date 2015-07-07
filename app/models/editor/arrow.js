let State = require('ampersand-state');
let ArrowView = require('app/components/editor/arrow');

let Arrow = State.extend({
  
  props: {
    start: 'object',
    magnitude: 'number',
    angle: 'number'
  },
  
  initialize (options) {
    
    let {
      start,
      magnitude
    } = options;
    
    this.start = start;
    this.magnitude = 30;
    this.angle = 90.0;
    
    this.view = new ArrowView({
      model: this
    });
  }
  
});

module.exports = Arrow;