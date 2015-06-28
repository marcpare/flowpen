let AmpersandView = require('ampersand-view');
let SidebarView = require('app/components/sidebar/sidebar');

module.exports = AmpersandView.extend({
  template: require('app/templates/app.jade'),
  
  subviews: {
    sidebar: {
      container: '#sidebar-container',
      constructor: SidebarView
    }
  }
});