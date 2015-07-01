let State = require('ampersand-state');
let SegmentView = require('app/components/editor/segment');

let Segment = State.extend({
  
  props: {
    x1: 'number',
    y1: 'number',
    x2: 'number',
    y2: 'number'
  },
  
  initialize () {
    this.view = new SegmentView({
      model: this
    });
  }
  
});

module.exports = Segment;