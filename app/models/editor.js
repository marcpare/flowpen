//
// Editor model
//
// A state machine that tracks the tool status, transition
// from state to state as users take actions.
//
//

let _ = require('underscore');
let Snack = require('app/models/snack');
let Cursor = require('app/models/cursor');
let Bus = require('app/lib/bus');
let PendingSegment = require('app/models/pending-segment');
let EditorObjects = require('app/models/editor-objects');
let Simulation = require('app/models/simulation');
let Inlet = require('app/models/editor/inlet');
let Wall = require('app/models/editor/wall');

let FinishSegmentAction = (options) => {
  
  Snack.message = 'Choose ending point';
  
  let onCanvasClick = e => {
    
    // clear everything
    Snack.clear();
    Cursor.pointer = 'none';
    
    // create the Wall object
    let segment = PendingSegment.finish(e.x, e.y);
    
    options.onComplete(segment);
    
  };
  Bus.once('canvas-click', onCanvasClick);
  
  // Cleanup on cancel
  Snack.actionHandler = () => {
    Snack.visible = false;
    Cursor.pointer = 'none';
    Bus.off('canvas-click', onCanvasClick);
    PendingSegment.clear();
  };
  
};

let StartSegmentAction = (options) => {
  
  Snack.visible = true;
  Snack.message = 'Choose starting point';
  Snack.action = 'Cancel';
  
  // Update cursor
  Cursor.pointer = 'trace-node';
  
  // Update click handler to transition to next state
  let onCanvasClick = e => {

    // mark the starting point
    PendingSegment.start(e.x, e.y);
    
    // transition to finishSegment state
    FinishSegmentAction(options);
    
  };
  Bus.once('canvas-click', onCanvasClick);
  
  // Cleanup on cancel
  Snack.actionHandler = () => {
    Snack.visible = false;
    Cursor.pointer = 'none';
    Bus.off('canvas-click', onCanvasClick);
  };
  
};

/*

Walk the user through drawing a line segment.

Options:

  onComplete: callback that returns the segment

*/
let DrawSegmentAction = (options) => {
  
  options.onComplete = options.onComplete || _.noop;
  
  StartSegmentAction(options);
  
};

let StartInletAction = () => {
  
  DrawSegmentAction({
    onComplete: segment => {
      
      EditorObjects.add(new Inlet({
        segment
      }));
      
    }
  });
  
};


let StartWallAction = () => {
  
  DrawSegmentAction({
    onComplete: segment => {
      
      EditorObjects.add(new Wall({
        segment
      }));
            
    }
  });
  
};


module.exports = {
  
  startWall: StartWallAction,
  startInlet: StartInletAction
  
};