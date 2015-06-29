let ToolView = require('app/components/tool/tool');
let Snack = require('app/models/snack');

let StartWallAction = () => {
  console.log('starting to draw wall');
  
  Snack.visible = true;
  Snack.message = 'Choose starting point';
  Snack.action = 'Cancel';
  
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