let State = require('ampersand-state');
let Geom = require('app/lib/geom');
let SegmentView = require('app/components/editor/segment');

let Segment = State.extend({
  
  props: {
    x1: 'number',
    y1: 'number',
    x2: 'number',
    y2: 'number',
    spectral: {
      type: 'boolean',
      default: false
    }
  },
  
  initialize () {
    this.view = new SegmentView({
      model: this
    });
  },
  
  segment () {
    return new Geom.Line(this.x1, this.y1, this.x2, this.y2);
  },
  
  midpoint () {
    return this.segment().midpoint();
  },
  
  angle () {
    return this.segment().angle();
  }
  
});

module.exports = Segment;