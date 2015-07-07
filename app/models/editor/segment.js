let State = require('ampersand-state');
let Geom = require('app/lib/geom');
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
  },
  
  midpoint () {
    return (new Geom.Line(this.x1, this.y1, this.x2, this.y2)).midpoint();
  }
  
});

module.exports = Segment;