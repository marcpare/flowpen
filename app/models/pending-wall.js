let EditorObjects = require('app/models/editor-objects');
let Node = require('app/models/geom/node');

// PendingWall
// singleton that tracks an in progress Wall creation

module.exports = {
  
  start (x, y) {
    
    EditorObjects.add(new Node({
      x: x,
      y: y
    }));
    
    // a line that follows the cursor...
    // let line = new Line({
    //   x1: x,
    //   y1: y,
    //   x2: x,
    //   y2: y
    // });
    //
    // this.listenTo(Cursor, 'change', e => {
    //   line.x2 = e.x;
    //   line.y2 = e.y;
    // });
    //
    // EditorObjects.push(line);
    
  }
  
};