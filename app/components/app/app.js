let AmpersandView = require('ampersand-view');
let SidebarView = require('app/components/sidebar/sidebar');
let SimulationView = require('app/components/simulation/simulation');
let SnackView = require('app/components/snack/snack');

module.exports = AmpersandView.extend({
  template: require('app/components/app/app.jade'),
  
  subviews: {
    sidebar: {
      container: '#sidebar-container',
      constructor: SidebarView
    },
    
    simulation: {
      container: '#simulation-container',
      prepareView (el) {
        return new SimulationView({
          el: el,
          simulationOptions: {
            rows: 128,
            columns: 256,
            debugBoundaries: true,
            initialModel: this.initialModel,
          }
        });
      }
    },
    
    snack: {
      container: '#snack-container',
      constructor: SnackView
    }
  },
  
  initialize (options) {
    let {initialModel} = options;
    this.initialModel = initialModel;
  },
  
});