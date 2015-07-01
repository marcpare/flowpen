// PendingWall
// singleton that tracks an in progress Wall creation

let State = require('ampersand-state');
let Cursor = require('app/models/cursor');
let EditorObjects = require('app/models/editor-objects');
let Node = require('app/models/editor/node');
let Line = require('app/models/editor/segment');

let PendingWall = State.extend({
  
  start (x, y) {
      
    // Node to mark the start position
    this.node = new Node({
      x: x,
      y: y
    });
    
    EditorObjects.add(this.node);
    
    // A line that follows the cursor...
    this.line = new Line({
      x1: x,
      y1: y,
      x2: x,
      y2: y
    });
    
    this.listenTo(Cursor, 'change', e => {
      this.line.x2 = e.x;
      this.line.y2 = e.y;
    });

    EditorObjects.add(this.line);
    
  },
  
  clear () {
    
    EditorObjects.remove(this.node);
    EditorObjects.remove(this.line);
    
    delete this.node;
    delete this.line;
    
    this.stopListening(Cursor);
    
  }
  
});

module.exports = new PendingWall();