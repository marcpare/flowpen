let ToolView = require('app/components/tool/tool');
let Editor = require('app/models/editor');

module.exports = ToolView.extend({  

  caption: 'Wall',
  
  events: {
    'click': 'startWall'
  },
  
  startWall: Editor.startWall
  
});