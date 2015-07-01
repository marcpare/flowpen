//
// Editor model
//
// A state machine that tracks the tool status, transition
// from state to state as users take actions.
//
//

let Snack = require('app/models/snack');
let Cursor = require('app/models/cursor');
let Bus = require('app/lib/bus');
let PendingWall = require('app/models/pending-wall');

let CancelWallAction = () => {
  Snack.visible = false;
};

let FinishWallAction = () => {
  Snack.message = 'Choose ending point';
  
  Bus.once('canvas-click', e => {
    
    // clear everything
    Snack.clear();
    Cursor.pointer = 'none';
    PendingWall.clear();
    
    // create the Wall object
    
    
  });
  
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
    
    // transition to finishWall state
    FinishWallAction();
    
  });
  
};


module.exports = {
  
  startWall: StartWallAction,
  finishWall: FinishWallAction
  
};