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
};


module.exports = {
  
  startWall: StartWallAction
  
};