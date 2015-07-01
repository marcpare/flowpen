//
// Editor model
//
// A state machine that tracks the tool status, transition
// from state to state as users take actions.
//
//

let Snack = require('app/models/snack');

let CancelWallAction = () => {
  Snack.visible = false;
};

let StartWallAction = () => {
  Snack.visible = true;
  Snack.message = 'Choose starting point';
  Snack.action = 'Cancel';
  Snack.actionHandler = CancelWallAction;
  
  // Update cursor
  Cursor.pointer = 'trace-node';
  
  // Update click handler to transition to next state
  Bus.once('canvas-click', e => {
    
    // mark the starting point
    PendingWall.start(e.x, e.y);
    
    Editor.FinishWallAction();
  });
  
};


module.exports = {
  
  startWall: StartWallAction
  
};