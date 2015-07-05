let ToolView = require('app/components/tool/tool');
let Editor = require('app/models/editor');

module.exports = ToolView.extend({  
  
  caption: 'Inlet',
  
  events: {
    'click': 'startInlet'
  },
  
  startInlet: Editor.startInlet
  
});