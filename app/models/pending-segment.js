// PendingSegment
// singleton that tracks an in progress Segment creation

let State = require('ampersand-state');
let Cursor = require('app/models/cursor');
let EditorObjects = require('app/models/editor-objects');
let Node = require('app/models/editor/node');
let Segment = require('app/models/editor/segment');

let PendingSegment = State.extend({
  
  start (x, y) {
      
    this.x1 = x;
    this.y1 = y;  
      
    // Node to mark the start position
    this.node = new Node({
      x: x,
      y: y
    });
    
    EditorObjects.add(this.node);
    
    // A segment that follows the cursor...
    this.segment = new Segment({
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      spectral: true
    });
    
    this.listenTo(Cursor, 'change', e => {
      this.segment.x2 = e.x;
      this.segment.y2 = e.y;
    });

    EditorObjects.add(this.segment);
    
  },
  
  finish (x, y) {
    
    // Create a Segment object
    let wall = new Segment({
      x1: this.x1,
      y1: this.y1,
      x2: x,
      y2: y
    });
    
    this.clear();
    
    return wall;
    
  },
  
  clear () {
    
    EditorObjects.remove(this.node);
    EditorObjects.remove(this.segment);
    
    delete this.node;
    delete this.segment;
    
    this.stopListening(Cursor);
    
  }
  
});

module.exports = new PendingSegment();