let AmpersandView = require('ampersand-view');
let WallToolView = require('app/components/tool-wall/tool-wall');
let InletToolView = require('app/components/tool-inlet/tool-inlet');

module.exports = AmpersandView.extend({
  template: require('app/components/sidebar/sidebar.jade'),
  
  subviews: {
    wallTool: {
      container: '#wall-tool-container',
      constructor: WallToolView
    },
    
    inletTool: {
      container: '#inlet-tool-container',
      constructor: InletToolView
    }
  }
});