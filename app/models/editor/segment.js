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
  
  initialize (options) {
    
    let {stateString} = options;
    
    if (stateString) {
      let sp = stateString.split(",");
      this.x1 = parseInt(sp[0]);
      this.y1 = parseInt(sp[1]);
      this.x2 = parseInt(sp[2]);
      this.y2 = parseInt(sp[3]);
    }
    
    this.view = new SegmentView({
      model: this
    });
  },
  
  
  urlSerializeCoords () {
    return `${this.x1},${this.y1},${this.x2},${this.y2}`;
  },
  
  asGeom () {
    return this.segment();
  },
  
  segment () {
    return new Geom.Line(this.x1, this.y1, this.x2, this.y2);
  },
  
  midpoint () {
    return this.segment().midpoint();
  },
  
  angle () {
    return this.segment().angle();
  },
  
  direction (p) {
    return this.segment().direction(p);
  },
  
  dx () {
    return this.segment().dx();
  },
  
  dy () {
    return this.segment().dy();
  },
  
});

module.exports = Segment;