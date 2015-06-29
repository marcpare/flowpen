let ToolView = require('app/components/tool/tool');
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

module.exports = ToolView.extend({  

  caption: 'Wall',
  
  events: {
    'click': 'start'
  },
  
  start () {
    // update the snacks view "choose start point"
    StartWallAction();
  }
  
});