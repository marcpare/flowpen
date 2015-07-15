let AmpersandView = require('ampersand-view');
let WallToolView = require('app/components/tool-wall/tool-wall');
let InletToolView = require('app/components/tool-inlet/tool-inlet');
let ClearControlView = require('app/components/control-clear/clear-control');
let ModalView = require('app/components/modal/modal');

module.exports = AmpersandView.extend({
  template: require('app/components/sidebar/sidebar.jade'),
  
  events: {
    'click [data-hook=share]': 'share'
  },
  
  subviews: {
    wallTool: {
      container: '#wall-tool-container',
      constructor: WallToolView
    },
    
    inletTool: {
      container: '#inlet-tool-container',
      constructor: InletToolView
    },
    
    clearControl: {
      container: '#clear-control-container',
      constructor: ClearControlView
    }
  },
  
  share: function () {
       
    let modal = new ModalView();
    modal.openIn('body');
    
  }
});