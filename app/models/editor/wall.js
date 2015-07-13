let State = require('ampersand-state');
let Simulation = require('app/models/simulation');
let SegmentView = require('app/components/editor/segment');
let Segment = require('app/models/editor/segment');

let Wall = State.extend({
  
  props: {
    segment: 'object'
  },
 
  initialize (options) {
    
    let {segment, stateString} = options;
    
    if (stateString) {
      this.segment = new Segment({stateString: stateString});
    } else {
      this.segment = segment;
    }
        
    this.view = new SegmentView({
      model: this.segment
    });
    
    // Add boundaries to the simulation
    Simulation.addWall({
      x1: this.segment.x1,
      y1: this.segment.y1,
      x2: this.segment.x2,
      y2: this.segment.y2,
      thickness: 2
    });
    
  },
  
  urlSerialize () {
    return `W${this.segment.urlSerializeCoords()}`;
  },
  
  destroy () {
        
    this.view.remove();
    
  },
  
});

module.exports = Wall;