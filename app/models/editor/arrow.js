let State = require('ampersand-state');
let ArrowView = require('app/components/editor/arrow');

let Arrow = State.extend({
  
  props: {
    start: 'object'
  },
  
  initialize (options) {
    
    let {
      start
    } = options;
    
    if (start) {
      this.start = start;
    }
    
    this.view = new ArrowView({
      model: this
    });
  }
  
});

module.exports = Arrow;