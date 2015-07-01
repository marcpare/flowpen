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
    EditorObjects.add(new Node({
      x: x,
      y: y
    }));
    
    // A line that follows the cursor...
    let line = new Line({
      x1: x,
      y1: y,
      x2: x,
      y2: y
    });
    
    this.listenTo(Cursor, 'change', e => {
      line.x2 = e.x;
      line.y2 = e.y;
    });

    EditorObjects.add(line);
    
  }
  
});

module.exports = new PendingWall();