let AmpersandView = require('ampersand-view');

module.exports = AmpersandView.extend({
  template: require('app/components/tool/tool.jade'),
  
  initialize (options) {
    this.caption = '<Missing Caption>';
  }
});