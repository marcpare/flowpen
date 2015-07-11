let State = require('ampersand-state');
let Simulation = require('app/models/simulation');
let SegmentView = require('app/components/editor/segment');

let Wall = State.extend({
  
  props: {
    segment: 'object'
  },
 
  initialize (options) {
    
    let {segment} = options;
    this.segment = segment;
    
    this.view = new SegmentView({
      model: segment
    });
    
    // Add boundaries to the simulation
    Simulation.addWall({
      x1: segment.x1,
      y1: segment.y1,
      x2: segment.x2,
      y2: segment.y2,
      thickness: 2
    });
    
  },
  
  urlSerialize () {
    return `W${this.segment.urlSerializeCoords()}`;
  },
  
});

module.exports = Wall;