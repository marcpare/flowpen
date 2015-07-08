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
      magnitude,
      angle
    } = options;
    
    this.start = start;
    this.magnitude = 30;
    this.angle = angle;
    
    this.view = new ArrowView({
      model: this
    });
  }
  
});

module.exports = Arrow;